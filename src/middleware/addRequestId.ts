import Express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { NextFunction, Request } from 'src/api';

export const addRequestId: Express.Handler = (req: Request, _res, nxt: NextFunction): void => {
  req.requestId = uuidv4();

  nxt();
};
