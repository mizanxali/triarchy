import type { HuddleClient } from '@huddle01/web-core';
import { CARD_DECK } from './constants';

class GameExecutor {
  #client: HuddleClient;

  blackPeerId: string | undefined;
  whitePeerId: string | undefined;

  blackCards: string[] = [];
  whiteCards: string[] = [];

  private generateInitialCards() {
    const initialCards: string[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * CARD_DECK.length);
      initialCards.push(CARD_DECK[randomIndex] as string);
    }

    return initialCards;
  }

  constructor(client: HuddleClient) {
    this.#client = client;

    this.#client.room.on('new-peer-joined', (event) => {
      if (!this.blackPeerId) {
        console.log('Black player joined');

        // set black player peerId
        this.blackPeerId = event.peer.peerId;

        // set and send black player their cards
        this.blackCards = this.generateInitialCards();
        this.#client.localPeer.sendData({
          to: [this.blackPeerId],
          label: 'initial-cards',
          payload: JSON.stringify(this.blackCards),
        });
      } else if (!this.whitePeerId) {
        console.log('White player joined');

        // set white player peerId
        this.whitePeerId = event.peer.peerId;

        // set and send white player their cards
        this.whiteCards = this.generateInitialCards();
        this.#client.localPeer.sendData({
          to: [this.whitePeerId],
          label: 'initial-cards',
          payload: JSON.stringify(this.whiteCards),
        });
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

        case 'card-played':
          this.cardPlayed(from, payload);
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

      if (!this.blackPeerId && !this.whitePeerId) {
        this.#client.room.close();
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

  private async cardPlayed(from: string, card: string) {
    if (from === this.blackPeerId) {
      console.log('Black played', card);
    } else if (from === this.whitePeerId) {
      console.log('White played', card);
    }
  }
}

export { GameExecutor };
