import type { TRPCRouterRecord } from '@trpc/server';

import { env } from '../env';
import { protectedProcedure } from '../procedures';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { z } from 'zod';

export const roomRouter = {
  createRoom: protectedProcedure.mutation(async () => {
    const res = await fetch(
      'https://api.huddle01.com/api/v2/sdk/rooms/create-room',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-api-key': env.HUDDLE01_API_KEY,
        }),
        body: JSON.stringify({
          title: 'Card Battle Room',
          hostWallets: [],
        }),
        cache: 'no-store',
      },
    );

    const data = await res.json();

    return data.data.roomId;
  }),

  createAccessToken: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const accessToken = new AccessToken({
        apiKey: env.HUDDLE01_API_KEY,
        roomId: input.roomId as string,
        role: Role.CO_HOST,
        permissions: {
          admin: true,
          canConsume: true,
          canProduce: true,
          canProduceSources: {
            cam: true,
            mic: true,
            screen: true,
          },
          canRecvData: true,
          canSendData: true,
          canUpdateMetadata: true,
        },
        options: {
          maxPeersAllowed: 2,
        },
      });

      const token = await accessToken.toJwt();

      return token;
    }),
} satisfies TRPCRouterRecord;
