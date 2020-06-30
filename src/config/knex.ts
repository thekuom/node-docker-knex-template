import Knex from 'knex';

import { logger } from 'src/lib/logger';
import { camelCase, snakeCase } from 'src/utils/changeCase';

const specialChars = ['*'];

const convertToCase = (val: object | string, func: Function): object | string => {
  if (typeof val === 'string' && specialChars.includes(val)) return val;

  return func(val);
};

export const config: Knex.Config = {
  client: 'pg',
  debug: process.env.KNEX_DEBUG === 'true',
  asyncStackTraces: process.env.KNEX_ASYNC_STACK_TRACE === 'true',
  pool: {
    min: parseInt(process.env.KNEX_POOL_MIN, 10) || 2,
    max: parseInt(process.env.KNEX_POOL_MAX, 10) || 10,
  },
  connection: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'db/migrations',
  },
  seeds: {
    directory: 'db/seeds',
  },
  postProcessResponse: (result) => convertToCase(result, camelCase),
  wrapIdentifier: (value, origImpl) => origImpl(convertToCase(value, snakeCase) as string),
  log: {
    warn(msg) { logger.warn('Knex: ', msg); },
    error(msg) { logger.error('Knex: ', msg); },
    deprecate(msg) { logger.warn('Knex: ', msg); },
    debug(msg) { logger.debug('Knex: ', msg); },
  },
};
