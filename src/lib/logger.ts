import getConfig from 'next/config';
import { default as pino } from 'pino';
import pretty from 'pino-pretty';
import { publicRuntimeConfig } from './publicRuntimeConfig';
import { serverRuntimeConfig } from './serverRuntimeConfig';

const stream = pretty({
  colorize: true,
});

const logger = pino(
  {
    level: serverRuntimeConfig.LOG_LEVEL,
    base: {
      env: publicRuntimeConfig.NODE_ENV,
    },
  },
  stream,
);

export default logger;
