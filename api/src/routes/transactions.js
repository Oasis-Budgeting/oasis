import db from '../db/knex.js';
import { parse } from 'csv-parse/sync';
import authenticate from '../middleware/auth.js';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export default async function transactionRoutes(fastify) {
    fastify.addHook('preHandler', authenticate);

    // List transactions with optional filters
    fastify.get('/', async (request) => {
        const { account_id, category_id, from, to, limit = 50, offset = 0 } = request.query;
        const userId = request.user.id;

        let query = db('transactions')
            .select(
                'transactions.*',
                'accounts.name as account_name',
                'categories.name as category_name',
                'category_groups.name as group_name'
            )
            .leftJoin('accounts', 'transactions.account_id', 'accounts.id')
            .leftJoin('categories', 'transactions.category_id', 'categories.id')
            .leftJoin('category_groups', 'categories.group_id', 'category_groups.id')
            .where('transactions.user_id', userId)
            .orderBy('transactions.date', 'desc')
            .orderBy('transactions.id', 'desc');

        if (account_id) query = query.where('transactions.account_id', account_id);
        if (category_id) query = query.where('transactions.category_id', category_id);
        if (from) query = query.where('transactions.date', '>=', from);
        if (to) query = query.where('transactions.date', '<=', to);

        const total = await query.clone().count('* as count').first();
        const transactions = await query.limit(limit).offset(offset);

        // Attach attachments metadata manually
        if (transactions.length > 0) {
            const txIds = transactions.map(t => t.id);
            const attachments = await db('attachments')
                .whereIn('transaction_id', txIds)
                .select('id', 'transaction_id', 'file_name', 'mime_type', 'size_bytes');

            transactions.forEach(t => {
                t.attachments = attachments.filter(a => a.transaction_id === t.id);
            });
        }

        return { data: transactions, total: total.count };
    });

    // Get single transaction
    fastify.get('/:id', async (request, reply) => {
        const txn = await db('transactions')
            .where({ id: request.params.id, user_id: request.user.id })
            .first();
        if (!txn) return reply.code(404).send({ error: 'Transaction not found' });
        return txn;
    });

    // Create transaction
    fastify.post('/', async (request, reply) => {
        const { account_id, category_id, date, payee, memo, amount, transfer_account_id, cleared = false } = request.body;
        const userId = request.user.id;

        if (!account_id || !date || amount === undefined) {
            return reply.code(400).send({ error: 'account_id, date, and amount are required' });
        }

        // Verify account belongs to user
        const account = await db('accounts').where({ id: account_id, user_id: userId }).first();
        if (!account) return reply.code(403).send({ error: 'Invalid account_id' });

        if (transfer_account_id) {
            const transferAccount = await db('accounts').where({ id: transfer_account_id, user_id: userId }).first();
            if (!transferAccount) return reply.code(403).send({ error: 'Invalid transfer_account_id' });
        }

        const [id] = await db('transactions').insert({
            user_id: userId, account_id, category_id, date, payee, memo, amount,
            transfer_account_id, cleared
        });

        // Update account balance
        await updateAccountBalance(account_id, userId);
        if (transfer_account_id) {
            // Create matching transfer transaction
            await db('transactions').insert({
                user_id: userId,
                account_id: transfer_account_id,
                date, payee: 'Transfer',
                memo, amount: -amount,
                transfer_account_id: account_id,
                cleared
            });
            await updateAccountBalance(transfer_account_id, userId);
        }

        const txn = await db('transactions').where({ id, user_id: userId }).first();
        return reply.code(201).send(txn);
    });

    // Update transaction
    fastify.put('/:id', async (request, reply) => {
        const userId = request.user.id;
        const existing = await db('transactions')
            .where({ id: request.params.id, user_id: userId })
            .first();
        if (!existing) return reply.code(404).send({ error: 'Transaction not found' });

        const { account_id, category_id, date, payee, memo, amount, cleared, reconciled } = request.body;
        const updates = {};
        if (account_id !== undefined) updates.account_id = account_id;
        if (category_id !== undefined) updates.category_id = category_id;
        if (date !== undefined) updates.date = date;
        if (payee !== undefined) updates.payee = payee;
        if (memo !== undefined) updates.memo = memo;
        if (amount !== undefined) updates.amount = amount;
        if (cleared !== undefined) updates.cleared = cleared;
        if (reconciled !== undefined) updates.reconciled = reconciled;

        if (account_id !== undefined && account_id !== existing.account_id) {
            const account = await db('accounts').where({ id: account_id, user_id: userId }).first();
            if (!account) return reply.code(403).send({ error: 'Invalid account_id' });
        }

        await db('transactions').where({ id: request.params.id, user_id: userId }).update(updates);

        // Recalculate balances
        await updateAccountBalance(existing.account_id, userId);
        if (updates.account_id && updates.account_id !== existing.account_id) {
            await updateAccountBalance(updates.account_id, userId);
        }

        const txn = await db('transactions').where({ id: request.params.id, user_id: userId }).first();
        return txn;
    });

    // Delete transaction
    fastify.delete('/:id', async (request, reply) => {
        const userId = request.user.id;
        const txn = await db('transactions')
            .where({ id: request.params.id, user_id: userId })
            .first();
        if (!txn) return reply.code(404).send({ error: 'Transaction not found' });

        await db('transactions').where({ id: request.params.id, user_id: userId }).del();
        await updateAccountBalance(txn.account_id, userId);
        return { success: true };
    });

    fastify.post('/import', async (request, reply) => {
        const data = await request.file();
        const userId = request.user.id;
        if (!data) return reply.code(400).send({ error: 'No file uploaded' });

        const buffer = await data.toBuffer();
        const csvContent = buffer.toString('utf-8');
        const records = parse(csvContent, { columns: true, skip_empty_lines: true });

        // Fetch all active rules for this user
        const rules = await db('transaction_rules')
            .where({ user_id: userId })
            .orderBy('priority', 'desc');

        // Extremely basic import that maps exact column names or standard fallbacks
        // Assume columns: date, payee, memo, amount
        const defaultAccount = await db('accounts').where('user_id', userId).first();
        if (!defaultAccount) return reply.code(400).send({ error: 'Create an account first' });

        let imported = 0;
        for (const row of records) {
            // Find columns flexibly
            const keys = Object.keys(row);
            const dateKey = keys.find(k => k.toLowerCase().includes('date')) || keys[0];
            const amountKey = keys.find(k => k.toLowerCase().includes('amount')) || keys.find(k => !isNaN(parseFloat(row[k])));
            const payeeKey = keys.find(k => k.toLowerCase().includes('payee') || k.toLowerCase().includes('description')) || keys[1];

            if (!dateKey || !amountKey) continue;

            let amountStr = row[amountKey].replace(/[^0-9.-]+/g, "");
            let amount = parseFloat(amountStr);
            if (isNaN(amount)) continue;

            const dateStr = row[dateKey];
            const d = new Date(dateStr);
            const date = isNaN(d) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];

            let finalPayee = row[payeeKey] ? row[payeeKey].substring(0, 255) : 'Imported';
            let finalCategoryId = null;
            let finalCleared = true;

            // Apply Rules Engine
            for (const rule of rules) {
                let matchTarget = '';
                if (rule.match_field === 'payee') matchTarget = finalPayee.toLowerCase();
                if (rule.match_field === 'amount') matchTarget = amount.toString();

                const matchVal = rule.match_value.toLowerCase();
                let isMatch = false;

                if (rule.match_type === 'contains' && matchTarget.includes(matchVal)) isMatch = true;
                if (rule.match_type === 'equals' && matchTarget === matchVal) isMatch = true;
                if (rule.match_type === 'starts_with' && matchTarget.startsWith(matchVal)) isMatch = true;

                if (rule.match_field === 'amount') {
                    const amtTarget = Math.abs(amount);
                    const amtVal = parseFloat(rule.match_value);
                    if (rule.match_type === 'less_than' && amtTarget < amtVal) isMatch = true;
                    if (rule.match_type === 'greater_than' && amtTarget > amtVal) isMatch = true;
                }

                if (isMatch) {
                    if (rule.set_category_id) finalCategoryId = rule.set_category_id;
                    if (rule.set_payee) finalPayee = rule.set_payee;
                    if (rule.set_cleared !== null) finalCleared = rule.set_cleared ? true : false;
                }
            }

            await db('transactions').insert({
                user_id: userId,
                account_id: defaultAccount.id,
                date: date,
                payee: finalPayee,
                amount: amount,
                category_id: finalCategoryId,
                cleared: finalCleared
            });
            imported++;
        }

        return { message: `Successfully imported ${imported} transactions.`, count: imported };
    });

    // Upload Attachment to Transaction
    fastify.post('/:id/attachments', async (request, reply) => {
        // Verify transaction ownership
        const tx = await db('transactions')
            .join('accounts', 'transactions.account_id', 'accounts.id')
            .where({ 'transactions.id': request.params.id, 'accounts.user_id': request.user.id })
            .first();

        if (!tx) return reply.code(404).send({ error: 'Transaction not found or unauthorized' });

        const parts = request.parts();
        const uploadedFiles = [];

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'data', 'uploads', request.user.id.toString());
        await fs.mkdir(uploadDir, { recursive: true });

        for await (const part of parts) {
            if (part.type === 'file') {
                const uniqueFilename = `${randomUUID()}-${part.filename}`;
                const filePath = path.join(uploadDir, uniqueFilename);
                const relativePath = path.join(request.user.id.toString(), uniqueFilename);

                // Write to disk
                const buffer = await part.toBuffer();
                await fs.writeFile(filePath, buffer);

                // Insert into DB
                const [id] = await db('attachments').insert({
                    user_id: request.user.id,
                    transaction_id: tx.id,
                    file_name: part.filename,
                    file_path: relativePath,
                    mime_type: part.mimetype,
                    size_bytes: buffer.length
                });

                const attachment = await db('attachments').where({ id }).first();
                uploadedFiles.push(attachment);
            }
        }

        return reply.code(201).send(uploadedFiles);
    });

    // Download/View Attachment
    fastify.get('/attachments/:attachmentId', async (request, reply) => {
        const attachment = await db('attachments')
            .where({ id: request.params.attachmentId, user_id: request.user.id })
            .first();

        if (!attachment) return reply.code(404).send({ error: 'Attachment not found' });

        const absolutePath = path.join(process.cwd(), 'data', 'uploads', attachment.file_path);
        try {
            await fs.access(absolutePath);
            reply.header('Content-Type', attachment.mime_type);
            reply.header('Content-Disposition', `inline; filename="${attachment.file_name}"`);
            return reply.send(createReadStream(absolutePath));
        } catch {
            return reply.code(404).send({ error: 'File missing from disk' });
        }
    });

    // Delete Attachment
    fastify.delete('/attachments/:attachmentId', async (request, reply) => {
        const attachment = await db('attachments')
            .where({ id: request.params.attachmentId, user_id: request.user.id })
            .first();

        if (!attachment) return reply.code(404).send({ error: 'Attachment not found' });

        // Delete from DB
        await db('attachments').where({ id: attachment.id }).del();

        // Delete from Disk
        const absolutePath = path.join(process.cwd(), 'data', 'uploads', attachment.file_path);
        try {
            await fs.unlink(absolutePath);
        } catch (e) {
            request.log.warn(`Failed to delete file from disk: ${absolutePath}`);
        }

        return { success: true };
    });
}

async function updateAccountBalance(accountId, userId) {
    const result = await db('transactions')
        .where({ account_id: accountId, user_id: userId })
        .sum('amount as total')
        .first();
    await db('accounts')
        .where({ id: accountId, user_id: userId })
        .update({ balance: result?.total || 0, updated_at: new Date().toISOString() });
}
