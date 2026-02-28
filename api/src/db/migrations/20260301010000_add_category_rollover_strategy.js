export async function up(knex) {
    return knex.schema.alterTable('categories', (table) => {
        table.string('rollover_strategy', 50).defaultTo('none').notNullable();
        table.integer('sweep_target_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
    });
}

export async function down(knex) {
    return knex.schema.alterTable('categories', (table) => {
        table.dropColumn('rollover_strategy');
        table.dropColumn('sweep_target_id');
    });
}
