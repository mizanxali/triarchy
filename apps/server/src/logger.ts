import pino from 'pino';

export const baseLogger = pino({
  transport: {
    targets: [
      {
        target: '@axiomhq/pino',
        options: {
          dataset: process.env.AXIOM_DATASET,
          token: process.env.AXIOM_TOKEN,
        },
      },
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    ],
  },
});

function getLogObjs(args: unknown[] | unknown): Record<string, unknown> {
  if (!Array.isArray(args)) {
    return args as Record<string, unknown>;
  }

  return args.reduce((acc, obj) => {
    if (typeof obj === 'object' && obj !== null) {
      // biome-ignore lint/performance/noAccumulatingSpread:
      return { ...acc, ...obj };
    }
    return acc;
  }, {});
}

const logger = {
  trace: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.trace(getLogObjs(data.args), data.message);
  },
  debug: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.debug(getLogObjs(data.args), data.message);
  },
  info: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.info(getLogObjs(data.args), data.message);
  },
  warn: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.info(getLogObjs(data.args), data.message);
  },
  error: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.error(getLogObjs(data.args), data.message);
  },
  fatal: (data: { message?: string; args: unknown[] | unknown }) => {
    baseLogger.fatal(getLogObjs(data.args), data.message);
  },
};

export default logger;
