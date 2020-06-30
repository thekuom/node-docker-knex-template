import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, RequestHandler } from 'express';
import Knex from 'knex';

dotenv.config();

import { Request, routers } from 'src/api';
import { config as knexConfig } from 'src/config/knex';
import { config as serverConfig } from 'src/config/server';
import { configureLogger, logger } from 'src/lib/logger';
import { beforeRequestMiddleware } from 'src/middleware';
import { getRepos } from 'src/repos';

const { port } = serverConfig;

export const buildApp = async (config: Knex.Config, logLevel = 'debug'): Promise<Express> => {
  configureLogger({ level: logLevel });

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Register middleware
  // Add knex to context
  const knex = Knex(config);
  app.use((req: Request, _res, next) => {
    req.context = {
      ...req.context,
      knex,
    };

    next();
  });
  app.use((req: Request, _res, next) => {
    req.context = {
      ...req.context,
      repos: getRepos(knex),
    };

    next();
  });
  beforeRequestMiddleware.forEach((mid: RequestHandler) => app.use(mid));

  routers.forEach(router => app.use(router.path, router.router));

  return app;
};

buildApp(knexConfig, 'verbose')
  .then(server => server.listen(port, () => logger.info(`Server started. Listening on port: ${port}`)));
