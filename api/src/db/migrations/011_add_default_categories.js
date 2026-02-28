/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // We want to add default categories for all existing users who have NO category groups.
    const users = await knex('users').select('id');

    const defaultGroups = [
        {
            name: 'Housing',
            categories: [
                { name: 'Rent/Mortgage' },
                { name: 'Home Maintenance' },
                { name: 'Property Taxes' },
            ]
        },
        {
            name: 'Utilities',
            categories: [
                { name: 'Electricity' },
                { name: 'Water' },
                { name: 'Internet' },
                { name: 'Trash' },
                { name: 'Cell Phone' }
            ]
        },
        {
            name: 'Food',
            categories: [
                { name: 'Groceries' },
                { name: 'Dining Out' }
            ]
        },
        {
            name: 'Transportation',
            categories: [
                { name: 'Auto Loan' },
                { name: 'Gas' },
                { name: 'Auto Maintenance' },
                { name: 'Auto Insurance' },
                { name: 'Public Transit' }
            ]
        },
        {
            name: 'Personal',
            categories: [
                { name: 'Clothing' },
                { name: 'Entertainment' },
                { name: 'Subscriptions' },
                { name: 'Hobbies' }
            ]
        },
        {
            name: 'Health & Fitness',
            categories: [
                { name: 'Medical/Dental' },
                { name: 'Gym/Sports' },
                { name: 'Pharmacy' }
            ]
        },
        {
            name: 'Savings & Debt',
            categories: [
                { name: 'Emergency Fund' },
                { name: 'Retirement' },
                { name: 'Extra Debt Payment' }
            ]
        }
    ];

    for (const user of users) {
        // Check if user has any groups
        const existingGroups = await knex('category_groups').where('user_id', user.id).first();
        if (!existingGroups) {
            let groupSortOrder = 1;

            for (const group of defaultGroups) {
                // Insert group
                const [groupId] = await knex('category_groups').insert({
                    user_id: user.id,
                    name: group.name,
                    sort_order: groupSortOrder++
                });

                // Insert categories
                let categorySortOrder = 1;
                const categoryInserts = group.categories.map(cat => ({
                    user_id: user.id,
                    group_id: groupId,
                    name: cat.name,
                    sort_order: categorySortOrder++
                }));

                if (categoryInserts.length > 0) {
                    await knex('categories').insert(categoryInserts);
                }
            }
        }
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // This is a data-only migration, reverting is destructive and might destroy user-customized defaults.
    // For safety, we'll leave it as a no-op down migration.
}
