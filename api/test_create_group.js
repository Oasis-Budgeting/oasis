import db from './src/db/knex.js';

async function testCreateGroup() {
    try {
        console.log('Inserting user data...');
        const [userId] = await db('users').insert({
            name: 'Test Create Group',
            email: 'testcreategroup@example.com',
            password_hash: 'hash'
        }).returning('id');

        const uId = userId.id || userId;
        console.log('User created:', uId);

        console.log('Inserting group...');
        const [id] = await db('category_groups').insert({
            user_id: uId,
            name: 'Test Group POST',
            sort_order: 1
        });
        console.log('Group inserted ID:', id);

        const group = await db('category_groups').where({ id, user_id: uId }).first();
        console.log('Fetched group:', group);

        // Cleanup
        await db('users').where({ id: uId }).del();
        console.log('Cleanup complete');
    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        process.exit(0);
    }
}

testCreateGroup();
