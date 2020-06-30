import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { Express } from 'express';
import Knex from 'knex';

dotenv.config();

import { getRepos } from 'src/repos';
import { buildApp } from 'src/server';
import { truncateTables } from 'src/utils/knex';

import { knexConfig } from './knexfile';
import { random } from './random';

chai.use(chaiHttp);

export let TEST_APP: Express; 

const knex = Knex(knexConfig);

before(async () => {
  await knex.migrate.latest();

  TEST_APP = await buildApp(knexConfig, 'silent');
});

afterEach(async () => {
  await truncateTables(knex);
});

after(async () => {
  await knex.migrate.rollback({}, true);
});

export const repos = getRepos(knex);

export { random };
