import Knex from 'knex';

import { UserRepo } from 'src/repos';

export async function seed(knex: Knex): Promise<any> {
  const userRepo = new UserRepo(knex);

  await userRepo.insertMany([{
    name: 'Test User',
  }]);
};
