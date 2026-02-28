/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // SQLite doesn't support dropping a primary key from an existing table.
    // 1. Rename the existing table to settings_old
    await knex.schema.renameTable('settings', 'settings_old');

    // 2. Create the new settings table with the composite primary key
    await knex.schema.createTable('settings', (table) => {
        table.string('key').notNullable();
        table.string('value').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');

        // Composite primary key
        table.primary(['key', 'user_id']);
    });

    // 3. Copy existing data - for any existing rows from prior migrations,
    // if a user_id was set, keep it. If not, we'll try to find the first user
    // or leave it null (though the schema might enforce it depending on usage).

    // We do a direct insert from select
    await knex.raw('INSERT INTO settings (key, value, user_id) SELECT key, value, user_id FROM settings_old');

    // 4. Drop the old table
    await knex.schema.dropTable('settings_old');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // To go down, recreate the table with original key-only primary key
    await knex.schema.renameTable('settings', 'settings_old');

    await knex.schema.createTable('settings', (table) => {
        table.string('key').primary();
        table.string('value').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });

    // When downgrading, we can only keep one setting per key (violating the new multi-user data),
    // but typically down migrations aren't perfectly lossless for composite keys.
    await knex.raw('INSERT OR REPLACE INTO settings (key, value, user_id) SELECT key, value, user_id FROM settings_old');

    await knex.schema.dropTable('settings_old');
}
