import { HuddleClient } from '@huddle01/web-core';
import { GameExecutor } from './GameExecutor';

import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { WebSocket } from 'ws';

import { WeriftHandler } from 'mediasoup-client-werift';
import { weriftCapabilities } from './constants';

class GameManagerExecutor {
  gameExecutorMap: Map<string, GameExecutor> = new Map();

  constructor() {
    console.log('GameManagerExecutor created');
  }

  private async createAccessToken(roomId: string) {
    try {
      const token = new AccessToken({
        apiKey: process.env.HUDDLE01_API_KEY ?? '',
        roomId,
        role: Role.HOST,
        options: {
          metadata: {
            displayName: 'GameExecutor',
          },
          maxPeersAllowed: 3,
        },
      });

      return token.toJwt();
    } catch (error) {
      console.error('Error creating access token', error);
    }
  }

  async joinRoom(roomId: string) {
    const client = new HuddleClient({
      projectId: process.env.HUDDLE01_PROJECT_ID ?? '',
      options: {
        wsPolyfill: WebSocket,
        handlerFactory: WeriftHandler.createFactory(weriftCapabilities),
        autoConsume: false,
      },
    });

    const token = await this.createAccessToken(roomId);

    if (!token) return;

    await client.joinRoom({ roomId, token });

    console.log('GameExecutor joined', roomId);

    const gameExecutor = new GameExecutor(client);

    this.gameExecutorMap.set(roomId, gameExecutor);

    client.room.on('room-closed', () => {
      console.log('Room closed');
      this.gameExecutorMap.delete(roomId);
    });
  }
}

export { GameManagerExecutor };
