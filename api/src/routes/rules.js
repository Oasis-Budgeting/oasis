import db from '../db/knex.js';
import authenticate from '../middleware/auth.js';

export default async function ruleRoutes(fastify, options) {
    fastify.addHook('preHandler', authenticate);

    // Get all transaction rules for the logged-in user
    fastify.get('/', async (request, reply) => {
        const userId = request.user.id;
        const rules = await db('transaction_rules')
            .where({ user_id: userId })
            .orderBy('priority', 'asc')
            .orderBy('created_at', 'desc');
        return rules;
    });

    // Create a new rule
    fastify.post('/', async (request, reply) => {
        const userId = request.user.id;
        const {
            match_field, match_type, match_value,
            set_category_id, set_payee, set_cleared, priority
        } = request.body;

        const [id] = await db('transaction_rules').insert({
            user_id: userId,
            match_field,
            match_type,
            match_value,
            set_category_id: set_category_id || null,
            set_payee: set_payee || null,
            set_cleared: set_cleared !== undefined ? set_cleared : null,
            priority: priority || 0
        });

        const rule = await db('transaction_rules').where({ id, user_id: userId }).first();
        reply.code(201);
        return rule;
    });

    // Update a rule
    fastify.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        const updates = request.body;

        // ensure user owns the rule
        const existing = await db('transaction_rules').where({ id, user_id: userId }).first();
        if (!existing) {
            return reply.code(404).send({ error: 'Rule not found' });
        }

        const safeUpdates = {
            match_field: updates.match_field,
            match_type: updates.match_type,
            match_value: updates.match_value,
            set_category_id: updates.set_category_id,
            set_payee: updates.set_payee,
            set_cleared: updates.set_cleared,
            priority: updates.priority
        };

        // remove undefined
        Object.keys(safeUpdates).forEach(key => safeUpdates[key] === undefined && delete safeUpdates[key]);

        await db('transaction_rules')
            .where({ id, user_id: userId })
            .update(safeUpdates);

        return db('transaction_rules').where({ id }).first();
    });

    // Delete a rule
    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;

        const deleted = await db('transaction_rules')
            .where({ id, user_id: userId })
            .delete();

        if (!deleted) {
            return reply.code(404).send({ error: 'Rule not found' });
        }

        return { success: true };
    });
}
