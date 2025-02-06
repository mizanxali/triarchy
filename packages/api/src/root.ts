import { authRouter } from './router/auth';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';
import { adminRouter } from './router/admin';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  adminRouter: adminRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
