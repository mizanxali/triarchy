import { HuddleClient } from '@huddle01/web-core';
import { GameExecutor } from './GameExecutor';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { WebSocket } from 'ws';
import { WeriftHandler } from 'mediasoup-client-werift';
import { weriftCapabilities } from './constants';
import Logger from './logger';

class GameManagerExecutor {
  gameExecutorMap: Map<string, GameExecutor> = new Map();
  #logger: typeof Logger;

  constructor() {
    this.#logger = Logger;
    this.#logger.info({
      message: 'GameManagerExecutor created',
      args: {},
    });
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
      this.#logger.error({
        message: 'Error in createAccessToken',
        args: {
          error,
        },
      });
    }
  }

  async joinRoom(roomId: string, wagerAmount: string) {
    try {
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

      console.log('client is now in room: ', client.room.roomId, roomId);

      const gameExecutor = new GameExecutor(client, roomId, wagerAmount);

      this.gameExecutorMap.set(roomId, gameExecutor);

      const roomClosedListener = () => {
        this.#logger.info({
          message: 'Room closed',
          args: {
            roomId,
          },
        });
        client.room.off('room-closed', roomClosedListener);
        this.gameExecutorMap.delete(roomId);
      };

      client.room.on('room-closed', roomClosedListener);
    } catch (error) {
      this.#logger.error({
        message: 'Error in joinRoom',
        args: {
          error,
        },
      });
    }
  }
}
export { GameManagerExecutor };
