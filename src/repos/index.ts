import Knex from 'knex';

import { UserRepo } from './user';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getRepos = (knex: Knex) => ({
  userRepo: new UserRepo(knex),
});

export { UserRepo };
