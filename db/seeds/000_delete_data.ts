import * as Knex from 'knex';

import { truncateTables } from 'src/utils/knex';

export async function seed(knex: Knex): Promise<void> {
  await truncateTables(knex);
};
