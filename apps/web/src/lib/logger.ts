import pino from 'pino';

import { getRequestContext } from './context';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  mixin() {
    const context = getRequestContext();

    if (!context) {
      return {};
    }

    return context;
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          options: { colorize: true },
          target: 'pino-pretty',
        }
      : undefined,
});

export default logger;
