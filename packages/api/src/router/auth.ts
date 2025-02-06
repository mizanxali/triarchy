import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../procedures';

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can see this secret message!';
  }),
  signOut: protectedProcedure.mutation((opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
