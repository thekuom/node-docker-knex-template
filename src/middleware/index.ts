import { addLoggerToContext } from './addLoggerToContext';
import { addRequestId } from './addRequestId';
import { logRequest } from './logRequest';

export const beforeRequestMiddleware = [
  addRequestId,
  addLoggerToContext,
  logRequest,
];
