import _ from 'lodash';
import winston from 'winston';
import Transport from 'winston-transport';

const { createLogger, transports, format } = winston;
const { combine, colorize, printf } = format;

// Custom format is for the console. We want our console logs to be pretty
const customFormat = printf(msg => {
  const { message, requestId, ...rest } = msg;

  const logObject = _.omit(rest, ['timestamp', 'label', 'level']);
  if (requestId) logObject.requestId = requestId;
  const logObjectStr = _.isEmpty(logObject) ? '' : JSON.stringify(logObject, null, 2);

  return `[${msg.timestamp}] ${msg.label} ${msg.level}: ${requestId ? `[${requestId}] ` : ''}${message} ${logObjectStr}`;
});

// The array of transports. We want to log to the console
const transportOpts: Transport[] = [
  new transports.Console({ format: combine(colorize(), customFormat), level: 'debug' }),
];

// Combining our custom format with some built in Winston formatting
const formatOpts = combine(format.label({ label: 'API' }), format.timestamp(), customFormat);

const defaultConfig: winston.LoggerOptions = {
  level: 'debug',
  format: formatOpts,
  transports: transportOpts,
};

const logger = createLogger(defaultConfig);

// Allow the dev to change the log config
export const configureLogger = (winstonConfig: winston.LoggerOptions): void => {
  if (winstonConfig.level) {
    logger.remove(transportOpts[0]);
    // Change the level of the console transport when they pass level
    transportOpts[0] = new transports.Console({ format: combine(colorize(), customFormat), level: winstonConfig.level });
  }

  logger.configure({
    ...defaultConfig,
    ...winstonConfig,
  });
};

export type Logger = winston.Logger;
export { logger };
