import { TRPCError, type TRPCRouterRecord } from '@trpc/server';

import { env } from '../env';
import { protectedProcedure } from '../procedures';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { z } from 'zod';

export const roomRouter = {
  createRoom: protectedProcedure
    .input(
      z.object({
        wagerAmount: z.string(),
      }),
    )
    .output(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const res = await fetch(
          'https://api.huddle01.com/api/v2/sdk/rooms/create-room',
          {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'x-api-key': env.HUDDLE01_API_KEY,
            }),
            body: JSON.stringify({
              title: 'Triumvirate Room',
              hostWallets: [],
            }),
            cache: 'no-store',
          },
        );

        const data = await res.json();

        const roomId: string = data.data.roomId;

        return {
          roomId,
        };
      } catch (error) {
        console.error('Error details:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create room',
          cause: error,
        });
      }
    }),

  createAccessToken: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { walletAddress } = ctx.session.user;

        const accessToken = new AccessToken({
          apiKey: env.HUDDLE01_API_KEY,
          roomId: input.roomId as string,
          role: Role.GUEST,
          permissions: {
            admin: true,
          },
          options: {
            maxPeersAllowed: 3,
            metadata: {
              displayName: walletAddress,
            },
          },
        });

        const token = await accessToken.toJwt();

        return token;
      } catch (error) {
        console.error('Error details:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create access token',
          cause: error,
        });
      }
    }),

  gameCreated: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        wagerAmount: z.string(),
      }),
    )
    .output(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await fetch(
          `${env.SERVER_URL}/${input.roomId}?wagerAmount=${input.wagerAmount}`,
        );

        return {
          roomId: input.roomId,
        };
      } catch (error) {
        console.error('Error details:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to notify game created',
        });
      }
    }),
} satisfies TRPCRouterRecord;
