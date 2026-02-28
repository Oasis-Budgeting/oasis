/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('attachments', (t) => {
        t.increments('id').primary();
        // user_id is crucial so we can verify ownership before serving files
        t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        t.integer('transaction_id').notNullable().references('id').inTable('transactions').onDelete('CASCADE');
        t.string('file_name').notNullable();
        t.string('file_path').notNullable(); // Relative path on disk or S3 URI
        t.string('mime_type').notNullable();
        t.integer('size_bytes').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('attachments');
}
