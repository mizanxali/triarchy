import type { HuddleClient } from '@huddle01/web-core';
import { CARD_DECK } from './constants';
import type { TCard } from '@battleground/validators';

class GameExecutor {
  #client: HuddleClient;

  blackPeerId = '';
  whitePeerId = '';

  blackCards: TCard[] = [];
  whiteCards: TCard[] = [];

  blackActiveCard: TCard | undefined;
  whiteActiveCard: TCard | undefined;

  blackWonCards: TCard[] = [];
  whiteWonCards: TCard[] = [];

  private generateInitialCards() {
    const initialCards: TCard[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * CARD_DECK.length);
      initialCards.push(CARD_DECK[randomIndex] as TCard);
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

        // set black player cards
        this.blackCards = this.generateInitialCards();
      } else if (!this.whitePeerId) {
        console.log('White player joined');

        // set white player peerId
        this.whitePeerId = event.peer.peerId;

        // set white player cards
        this.whiteCards = this.generateInitialCards();
      }

      if (this.blackPeerId && this.whitePeerId) {
        // send both players their cards
        this.#client.localPeer.sendData({
          to: [this.blackPeerId],
          label: 'initial-cards',
          payload: JSON.stringify(this.blackCards),
        });

        this.#client.localPeer.sendData({
          to: [this.whitePeerId],
          label: 'initial-cards',
          payload: JSON.stringify(this.whiteCards),
        });
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
        this.blackPeerId = '';
      } else if (event.peerId === this.whitePeerId) {
        console.log('White player left');
        this.whitePeerId = '';
      }

      if (!this.blackPeerId || !this.whitePeerId) {
        console.log('Closing room');
        this.#client.room.close();
      }
    });
  }

  private async receivedPing(from: string, message: string) {
    if (from === this.blackPeerId) {
      this.#client.localPeer.sendData({
        to: [this.whitePeerId],
        label: 'pong',
        payload: message,
      });
    } else if (from === this.whitePeerId) {
      this.#client.localPeer.sendData({
        to: [this.blackPeerId],
        label: 'pong',
        payload: message,
      });
    }
  }

  private async cardPlayed(from: string, card: TCard) {
    if (from === this.blackPeerId) {
      console.log('Black played', card);
      // set the active card for black
      this.blackActiveCard = card;
    } else if (from === this.whitePeerId) {
      console.log('White played', card);
      // set the active card for white
      this.whiteActiveCard = card;
    }

    if (this.blackActiveCard && this.whiteActiveCard) {
      // compare cards
      const blackCardSuit = this.blackActiveCard.slice(0, 1);
      const whiteCardSuit = this.whiteActiveCard.slice(0, 1);

      const blackCardValue = this.blackActiveCard.slice(1);
      const whiteCardValue = this.whiteActiveCard.slice(1);

      if (blackCardSuit === whiteCardSuit) {
        // copmare values
        if (blackCardValue > whiteCardValue) this.blackWinsTurn();
        else if (blackCardValue < whiteCardValue) this.whiteWinsTurn();
        else this.turnDrawn();
      } else {
        // A beats H, H beats S, S beats A
        if (blackCardSuit === 'A') {
          if (whiteCardSuit === 'H') this.blackWinsTurn();
          else this.whiteWinsTurn();
        } else if (blackCardSuit === 'H') {
          if (whiteCardSuit === 'S') this.blackWinsTurn();
          else this.whiteWinsTurn();
        } else if (blackCardSuit === 'S') {
          if (whiteCardSuit === 'A') this.blackWinsTurn();
          else this.whiteWinsTurn();
        }
      }
    }
  }

  private async blackWinsTurn() {
    console.log('Black wins');

    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // add the active card to the winner's won cards
    this.blackWonCards.push(this.blackActiveCard);

    // reset cards states
    this.resetCardsAfterTurn();

    // send the updated cards to the players
    this.#client.localPeer.sendData({
      to: [this.blackPeerId],
      label: 'turn-win',
      payload: JSON.stringify({
        cards: this.blackCards,
        wonCards: this.blackWonCards,
      }),
    });
    this.#client.localPeer.sendData({
      to: [this.whitePeerId],
      label: 'turn-lose',
      payload: JSON.stringify({
        cards: this.whiteCards,
        wonCards: this.whiteWonCards,
      }),
    });
  }

  private async whiteWinsTurn() {
    console.log('White wins');

    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // add the active cards to the winner's won cards
    this.whiteWonCards.push(this.whiteActiveCard);

    // reset cards states
    this.resetCardsAfterTurn();

    // send the updated cards to the players
    this.#client.localPeer.sendData({
      to: [this.whitePeerId],
      label: 'turn-win',
      payload: JSON.stringify({
        cards: this.whiteCards,
        wonCards: this.whiteWonCards,
      }),
    });
    this.#client.localPeer.sendData({
      to: [this.blackPeerId],
      label: 'turn-lose',
      payload: JSON.stringify({
        cards: this.blackCards,
        wonCards: this.blackWonCards,
      }),
    });
  }

  private async turnDrawn() {
    console.log('Turn drawn');

    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // reset cards states
    this.resetCardsAfterTurn();

    // send the updated cards to the players
    this.#client.localPeer.sendData({
      to: [this.blackPeerId],
      label: 'turn-draw',
      payload: JSON.stringify({
        cards: this.blackCards,
        wonCards: this.blackWonCards,
      }),
    });
    this.#client.localPeer.sendData({
      to: [this.whitePeerId],
      label: 'turn-draw',
      payload: JSON.stringify({
        cards: this.whiteCards,
        wonCards: this.whiteWonCards,
      }),
    });
  }

  private async resetCardsAfterTurn() {
    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // store the indices before removing cards
    const blackIndex = this.blackCards.indexOf(this.blackActiveCard);
    const whiteIndex = this.whiteCards.indexOf(this.whiteActiveCard);

    // remove first instance of the active card from each player's hand
    this.blackCards.splice(blackIndex, 1);
    this.whiteCards.splice(whiteIndex, 1);

    // add new cards at the same positions
    this.blackCards.splice(
      blackIndex,
      0,
      CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)] as TCard,
    );
    this.whiteCards.splice(
      whiteIndex,
      0,
      CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)] as TCard,
    );

    // reset active cards
    this.blackActiveCard = undefined;
    this.whiteActiveCard = undefined;
  }
}

export { GameExecutor };
