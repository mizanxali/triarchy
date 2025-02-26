import 'dotenv/config';
import express from 'express';
import { GameManagerExecutor } from './GameManagerExecutor';
import { Role } from '@huddle01/server-sdk/auth';
import { AccessToken } from '@huddle01/server-sdk/auth';
import cors from 'cors';

const main = async () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(express.json());

  const gameManagerExecutor = new GameManagerExecutor();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.post('/room', async (req, res) => {
    const wagerAmount = req.body.wagerAmount;

    const resp = await fetch(
      'https://api.huddle01.com/api/v2/sdk/rooms/create-room',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-api-key': process.env.HUDDLE01_API_KEY ?? '',
        }),
        body: JSON.stringify({
          title: 'Triumvirate Room',
          hostWallets: [],
        }),
      },
    );

    const data = (await resp.json()) as { data: { roomId: string } };

    const roomId: string = data.data.roomId;

    await gameManagerExecutor.joinRoom(roomId, wagerAmount);

    res.json({
      roomId,
    });
  });

  app.post('/token', async (req, res) => {
    const { walletAddress, roomId } = req.body;

    const accessToken = new AccessToken({
      apiKey: process.env.HUDDLE01_API_KEY ?? '',
      roomId: roomId as string,
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

    res.json({
      token,
    });
  });

  app.listen(process.env.PORT ?? 7878, () => {
    console.log(`Example app listening on port ${process.env.PORT ?? 7878}!`);
  });
};

main().catch((error) => {
  console.error('Error:', error);
});
