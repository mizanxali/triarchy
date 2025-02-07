import { authRouter } from './router/auth';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';
import { adminRouter } from './router/admin';
import { roomRouter } from './router/room';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  adminRouter: adminRouter,
  user: userRouter,
  room: roomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
