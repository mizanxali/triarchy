import type { HuddleClient } from '@huddle01/web-core';

class GameExecutor {
  #client: HuddleClient;

  blackPeerId: string | undefined;
  whitePeerId: string | undefined;

  constructor(client: HuddleClient) {
    console.log('GameExecutor');
    this.#client = client;

    this.#client.room.on('new-peer-joined', (event) => {
      console.log('new-peer-joined');
      if (this.blackPeerId) {
        this.whitePeerId = event.peer.peerId;
      } else {
        this.blackPeerId = event.peer.peerId;
      }
    });

    this.#client.localPeer.on('receive-data', (data) => {
      console.log('receive-data', data);
    });
  }
}

export { GameExecutor };
