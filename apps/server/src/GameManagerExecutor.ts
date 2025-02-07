import { HuddleClient } from '@huddle01/web-core';
import { GameExecutor } from './GameExecutor';

import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { WebSocket } from 'ws';

import { WeriftHandler } from 'mediasoup-client-werift';
import { weriftCapabilities } from './constants';

class GameManagerExecutor {
  gameExecutorMap: Map<string, GameExecutor> = new Map();

  constructor() {
    console.log('GameManagerExecutor');
  }

  private async createAccessToken(roomId: string) {
    const token = new AccessToken({
      apiKey: process.env.HUDDLE01_API_KEY ?? '',
      roomId,
      role: Role.HOST,
      options: {
        metadata: {
          displayName: 'computer',
        },
        maxPeersAllowed: 3,
      },
    });

    return token.toJwt();
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

    await client.joinRoom({ roomId, token });

    const gameExecutor = new GameExecutor(client);

    this.gameExecutorMap.set(roomId, gameExecutor);

    for (const roomId of this.gameExecutorMap.keys()) {
      console.log('Room ID:', roomId);
    }
  }
}

export { GameManagerExecutor };
