import { config } from 'src/config/knex';

export const knexConfig = {
  ...config,
  connection: {
    host: process.env.POSTGRES_TEST_HOST,
    port: parseInt(process.env.POSTGRES_TEST_PORT),
    user: process.env.POSTGRES_TEST_USER,
    password: process.env.POSTGRES_TEST_PASSWORD,
    database: process.env.POSTGRES_TEST_DB,
  },
};
