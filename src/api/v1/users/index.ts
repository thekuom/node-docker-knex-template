import expressRouter from 'express-promise-router';

import { Route } from 'src/api';
import { config as serverConfig } from 'src/config/server';
import { registerRoutes } from 'src/utils/router';

import { read } from './read';

const routes: Route[] = [
  read,
];

const router = expressRouter(serverConfig.router);
registerRoutes(router, routes);

export const userRouter = {
  path: '/users',
  router,
};
