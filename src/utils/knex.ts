import Knex from 'knex';

import { config as knexConfig } from 'src/config/knex';

interface TablenameResult {
  rows: Array<{ tablename: string }>;
}

export const truncateTables = async (knex: Knex): Promise<void> => {
  const blacklist = [knexConfig.migrations.tableName, `${knexConfig.migrations.tableName}_lock`];
  const data = await knex.raw<TablenameResult>("select tablename from pg_tables where schemaname='public'");
  const tables = data.rows.map(table => table.tablename).filter(table => blacklist.indexOf(table) < 0);

  if (!tables.length) return;

  await knex.raw(`truncate ${tables.join(',')} cascade`);
};
