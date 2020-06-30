import Knex from 'knex';

import { User } from 'src/entities';

import { BaseRepo } from './base';

export class UserRepo extends BaseRepo<User> {
  constructor(knex: Knex) {
    super(knex, 'users');
  }
}
