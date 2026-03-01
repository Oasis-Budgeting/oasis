// Let's test the budget allocation and category deletion more comprehensively.
import db from './src/db/knex.js';

async function testCascade() {
    try {
        const uId = 25; // User ID from our earlier created user

        // 1. Create group
        const [groupId] = await db('category_groups').insert({
            user_id: uId, name: 'Cascade Test Group', sort_order: 1
        }).returning('id');
        const gId = groupId.id || groupId;

        // 2. Create category
        const [catId] = await db('categories').insert({
            user_id: uId, group_id: gId, name: 'Cascade Test Cat', sort_order: 1
        }).returning('id');
        const cId = catId.id || catId;

        // 3. Create budget allocation assignment
        await db('budget_allocations').insert({
            user_id: uId, category_id: cId, month: '2026-03', assigned: 50.00
        });

        // 4. Create an account
        const [accId] = await db('accounts').insert({
            user_id: uId, name: 'Test Acct', type: 'checking'
        }).returning('id');
        const accountId = accId.id || accId;

        // 5. Create transaction
        await db('transactions').insert({
            user_id: uId, account_id: accountId, category_id: cId, date: '2026-03-01', amount: -10.00
        });

        console.log(`Setup complete. Cat ID: ${cId}. Attempting deletion...`);

        // 6. Delete category using exact backend query shape
        const deleted = await db('categories')
            .where({ id: cId.toString(), user_id: uId.toString() })
            .del();

        console.log('Categories deleted:', deleted);

        // Verify cascades worked
        const allocations = await db('budget_allocations').where({ category_id: cId.toString() });
        console.log(`Allocations remaining: ${allocations.length}`);

        const txns = await db('transactions').where({ id: 1 }).first(); // Assuming txn 1

    } catch (e) {
        console.error('Test Failed:', e);
    } finally {
        process.exit(0);
    }
}
testCascade();
