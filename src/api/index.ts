import Express from 'express';
import expressRouter from 'express-promise-router';
import Knex from 'knex';

import { config as serverConfig } from 'src/config/server';
import { Logger } from 'src/lib/logger';
import { getRepos } from 'src/repos';

/** The different HTTPMethods for a REST API */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestTypeArgs {
  Params?: any;
  ResBody?: any;
  ReqBody?: any;
  Query?: any;
}

/** Re-export here in case we ever want to add on to the Request object */
export type Request<T extends RequestTypeArgs = RequestTypeArgs> = Express.Request<T['Params'], T['ResBody'], T['ReqBody'], T['Query']> & {
  requestId?: string;
  context?: RequestContext;
};

/** Re-export here in case we ever want to add on to the Response object */
export type Response<T= any> = Express.Response<T>;

/**
 * We likely won't add on to the NextFunction object object, so this
 * is really here for convenience, so we can import Request, Response, and
 * NextFunction all from the same place
 */
export type NextFunction = Express.NextFunction;

interface RequestContext {
  logger: Logger;
  knex: Knex;
  repos: ReturnType<typeof getRepos>;
}

/**
 * The structure to build a route off of
 */
export interface Route {
  /** The method of the route */
  method: HTTPMethod;
  /** The path of the route. Note: this needs to match up with how express builds routers */
  path: string;
  /** The function that performs the route */
  controller: <RequestTypes extends RequestTypeArgs>(req: Request<RequestTypes>, res: Response<RequestTypes['ResBody']>, next?: NextFunction) => void | Promise<void>;
  errorHandler?: <RequestTypes extends RequestTypeArgs>(err: any, req: Request<RequestTypes>, res: Response<RequestTypes['ResBody']>, next: NextFunction) => void | Promise<void>;
}

/**
 * A router that will give us information on how to register the router to our API
 */
export interface Router {
  /** What path to use for the router. Note: this needs to match up with how express builds routers */
  path: string;
  /** The express router to hook up */
  router: Express.Router;
}

import { v1Router } from './v1';

const router = expressRouter(serverConfig.router);
router.use(v1Router.path, v1Router.router);

const apiRouter = {
  path: '/api',
  router,
};

export const routers: Router[] = [
  apiRouter,
];
