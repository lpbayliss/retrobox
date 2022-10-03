import { default as pino } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL,
    base: {
      env: process.env.NODE_ENV,
    },
  },
  stream,
);

export default logger;
