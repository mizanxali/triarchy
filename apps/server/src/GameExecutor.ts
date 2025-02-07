import type { HuddleClient } from '@huddle01/web-core';

class GameExecutor {
  #client: HuddleClient;

  blackPeerId: string | undefined;
  whitePeerId: string | undefined;

  constructor(client: HuddleClient) {
    console.log('GameExecutor');
    this.#client = client;

    this.#client.room.on('new-peer-joined', (event) => {
      if (!this.blackPeerId) {
        console.log('Black player joined');
        this.blackPeerId = event.peer.peerId;
      } else if (!this.whitePeerId) {
        console.log('White player joined');
        this.whitePeerId = event.peer.peerId;
      } else {
        console.log('Spectator joined');
      }
    });

    this.#client.localPeer.on('receive-data', (data) => {
      const { from, label, payload } = data;

      switch (label) {
        case 'ping':
          this.receivedPing(from, payload);
          break;
      }
    });

    this.#client.room.on('peer-left', (event) => {
      if (event.peerId === this.blackPeerId) {
        console.log('Black player left');
        this.blackPeerId = undefined;
      } else if (event.peerId === this.whitePeerId) {
        console.log('White player left');
        this.whitePeerId = undefined;
      } else {
        console.log('Spectator left');
      }
    });
  }

  private async receivedPing(from: string, message: string) {
    if (from === this.blackPeerId && this.whitePeerId) {
      this.#client.localPeer.sendData({
        to: [this.whitePeerId],
        label: 'pong',
        payload: message,
      });
    } else if (from === this.whitePeerId && this.blackPeerId) {
      this.#client.localPeer.sendData({
        to: [this.blackPeerId],
        label: 'pong',
        payload: message,
      });
    }
  }
}

export { GameExecutor };
