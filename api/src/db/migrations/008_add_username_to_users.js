/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasColumn = await knex.schema.hasColumn('users', 'username');
    if (!hasColumn) {
        await knex.schema.alterTable('users', table => {
            table.string('username').unique();
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('users', table => {
        table.dropColumn('username');
    });
}
