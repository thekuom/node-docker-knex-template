import Express from 'express';

import { Route } from 'src/api';
import { logger } from 'src/lib/logger';

const next: Express.Handler = (_req, _res, nxt): void => nxt();

export const registerRoutes = (router: Express.Router, routes: Route[]): void => {
  routes.forEach((route: Route) => {
    const errorHandler = route.errorHandler || next;

    try {
      router[route.method.toLowerCase()](route.path, route.controller, errorHandler);
    } catch (err) {
      logger.error(`Error registering route ${route.method} ${route.path}`, err);

      throw new Error(`Failed to register route for ${route.method} ${route.path}`);
    }
  });
};
