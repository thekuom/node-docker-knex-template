import Express from 'express';

import { NextFunction, Request } from 'src/api';

export const logRequest: Express.Handler = (req: Request, _res, nxt: NextFunction): void => {
  if (req.path === '/api/v1/health') {
    nxt(); // ignore this one bc it is annoying

    return;
  }

  const headers = { ...req.headers };
  if (headers.authorization) headers.authorization = '[Redacted]';

  const params = req.params;
  const query = req.query;
  const body = { ...req.body };
  if (body.password) body.password = '[Redacted]';

  const { logger } = req.context;

  logger.info(`Starting ${req.method} ${req.url}`);
  logger.verbose('Request ', {
    request: {
      method: req.method,
      path: req.path,
      headers,
      params,
      query,
      body,
    },
  });

  nxt();
};
