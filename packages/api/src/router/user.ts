import type { TRPCRouterRecord } from '@trpc/server';
import { z } from 'zod';

import { createChallengeToken } from '@battleground/web3/jwt';
import { publicProcedure } from '../procedures';

export const userRouter = {
  generateChallenge: publicProcedure
    .input(z.object({ walletAddress: z.string().toLowerCase() }))
    .mutation(async ({ input }) => {
      return createChallengeToken(input.walletAddress);
    }),
} satisfies TRPCRouterRecord;
