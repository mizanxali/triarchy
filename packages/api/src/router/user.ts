import type { TRPCRouterRecord } from '@trpc/server';
import { z } from 'zod';

import { desc, eq } from '@battleground/db';
import { ChallengeStore, User } from '@battleground/db/schema';
import { constructMessage, generateNonce } from '@battleground/web3';

import { publicProcedure } from '../procedures';

export const userRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.User.findMany({
      orderBy: desc(User.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.User.findFirst({
        where: eq(User.id, input.id),
      });
    }),

  generateChallenge: publicProcedure
    .input(z.object({ walletAddress: z.string().toLowerCase() }))
    .mutation(async ({ ctx, input }) => {
      const now = Date.now();
      const issuedAt = new Date(now);

      const expiresAt = new Date(now + 5 * 60 * 1000);

      const nonce = await generateNonce();

      const existingMessage = await ctx.db.query.ChallengeStore.findFirst({
        where: eq(ChallengeStore.walletAddress, input.walletAddress),
      });

      if (existingMessage) {
        await ctx.db
          .update(ChallengeStore)
          .set({
            issuedAt,
            expiresAt,
            nonce,
          })
          .where(eq(ChallengeStore.walletAddress, input.walletAddress));

        const message = constructMessage({
          walletAddress: input.walletAddress,
          issuedAt,
          expiresAt,
          nonce,
        });

        return message;
      }

      await ctx.db.insert(ChallengeStore).values([
        {
          walletAddress: input.walletAddress,
          issuedAt,
          expiresAt,
          nonce,
        },
      ]);

      const message = constructMessage({
        walletAddress: input.walletAddress,
        issuedAt,
        expiresAt,
        nonce,
      });

      return message;
    }),
} satisfies TRPCRouterRecord;
