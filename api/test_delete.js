import db from './src/db/knex.js';

async function testDelete() {
    try {
        console.log('Inserting test data...');
        // Insert user
        const [userId] = await db('users').insert({
            name: 'Test',
            email: 'testdelete@example.com',
            password_hash: 'hash'
        }).returning('id');

        const uId = userId.id || userId;

        // Insert group
        const [groupId] = await db('category_groups').insert({
            user_id: uId,
            name: 'Test Group',
            sort_order: 1
        }).returning('id');

        const gId = groupId.id || groupId;

        // Insert category
        const [catId] = await db('categories').insert({
            user_id: uId,
            group_id: gId,
            name: 'Test Cat',
            sort_order: 1
        }).returning('id');

        const cId = catId.id || catId;

        console.log('Category inserted with ID:', cId);

        // Try deleting
        const deleted = await db('categories')
            .where({ id: cId.toString(), user_id: uId.toString() })
            .del();

        console.log('Deleted rows:', deleted);

        // Delete user to cleanup (cascades)
        await db('users').where({ id: uId }).del();
        console.log('Test complete. Success.');
    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        process.exit(0);
    }
}

testDelete();
