import expressRouter from 'express-promise-router';

import { config as serverConfig } from 'src/config/server';
import { registerRoutes } from 'src/utils/router';

import { Route } from '../';

import { health } from './health';
import { userRouter } from './users';

const routes: Route[] = [
  health,
];

const router = expressRouter(serverConfig.router);
registerRoutes(router, routes);

router.use(userRouter.path, userRouter.router);

export const v1Router = {
  path: '/v1',
  router,
};
