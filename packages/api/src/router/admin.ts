import { eq } from '@battleground/db';
import { User } from '@battleground/db/schema';
import type { TRPCRouterRecord } from '@trpc/server';
import { z } from 'zod';
import { adminProcedure } from '../procedures';

export const adminRouter = {
  deleteUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(User).where(eq(User.id, input.id));
    }),
} satisfies TRPCRouterRecord;
