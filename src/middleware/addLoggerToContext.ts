import Express from 'express';

import { Request, NextFunction } from 'src/api';
import { logger } from 'src/lib/logger';

export const addLoggerToContext: Express.Handler = (req: Request, _res, nxt: NextFunction): void => {
  const requestLogger = logger.child({ requestId: req.requestId });

  req.context = {
    ...req.context,
    logger: requestLogger,
  };

  nxt();
};
