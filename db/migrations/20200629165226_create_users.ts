import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', t => {
    t.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name');

    t.timestamp('createdAt', { useTz: true, precision: 3 }).defaultTo(knex.raw('now()'));
    t.timestamp('updatedAt', { useTz: true, precision: 3 });
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('users');
}
