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

    const roomId: string = data.data.roomId;

    await fetch(`http://localhost:7878/${roomId}`);

    return roomId;
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
        role: Role.GUEST,
        permissions: {
          admin: true,
        },
        options: {
          maxPeersAllowed: 3,
        },
      });

      const token = await accessToken.toJwt();

      return token;
    }),
} satisfies TRPCRouterRecord;
