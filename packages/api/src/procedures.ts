import { TRPCError } from '@trpc/server';
import { t } from './trpc';

// Middleware is used to add delays
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.info(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

// Public procedures are available to everyone, including unauthenticated users
export const publicProcedure = t.procedure.use(timingMiddleware);

// Protected procedures are only available to authenticated users
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to perform this action',
      });
    }

    return next({
      ctx: {
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            walletAddress: ctx.session.user.walletAddress.toLowerCase(),
          },
        },
      },
    });
  });

// Admin procedures are only available to users with the isAdmin flag set to true
const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.isAdmin) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    return next();
  });
