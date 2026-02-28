export const up = function (knex) {
    return knex.schema.createTable('transaction_rules', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.integer('priority').defaultTo(0).notNullable(); // For ordering multiple rules
        table.string('match_field').notNullable(); // e.g. 'payee', 'amount'
        table.string('match_type').notNullable(); // e.g. 'contains', 'equals', 'starts_with', 'less_than'
        table.string('match_value').notNullable();

        // Actions
        table.integer('set_category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
        table.string('set_payee');
        table.boolean('set_cleared');

        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

export const down = function (knex) {
    return knex.schema.dropTable('transaction_rules');
};
