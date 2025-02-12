import type { TCard, TPeerMetadata } from '@battleground/validators';
import type { HuddleClient } from '@huddle01/web-core';
import type { LocalPeerEvents, RoomEvents } from '@huddle01/web-core/types';
import { CARD_DECK } from './constants';
import { v4 as uuidv4 } from 'uuid';

class GameExecutor {
  #client: HuddleClient;

  blackWalletAddress: string | undefined;
  whiteWalletAddress: string | undefined;

  blackPeerId: string | undefined;
  whitePeerId: string | undefined;

  blackCards: {
    card: TCard;
    id: string;
  }[] = [];
  whiteCards: {
    card: TCard;
    id: string;
  }[] = [];

  blackActiveCard:
    | {
        card: TCard;
        id: string;
      }
    | undefined;
  whiteActiveCard:
    | {
        card: TCard;
        id: string;
      }
    | undefined;

  blackWonCards: {
    card: TCard;
    id: string;
  }[] = [];
  whiteWonCards: {
    card: TCard;
    id: string;
  }[] = [];

  private newPeerHandler:
    | ((data: RoomEvents['new-peer-joined'][0]) => void)
    | undefined;
  private receiveDataHandler:
    | ((data: LocalPeerEvents['receive-data'][0]) => void)
    | undefined;
  private peerLeftHandler:
    | ((data: RoomEvents['peer-left'][0]) => void)
    | undefined;

  constructor(client: HuddleClient) {
    this.#client = client;

    this.newPeerHandler = (event) => {
      try {
        if (!this.blackPeerId) {
          console.log('Black player joined');

          // set black player peerId
          this.blackPeerId = event.peer.peerId;

          // set black player wallet address
          const metadata = event.peer.getMetadata() as TPeerMetadata;
          this.blackWalletAddress = metadata.displayName;

          // set black player cards
          this.blackCards = [...this.generateInitialCards()];
        } else if (!this.whitePeerId) {
          console.log('White player joined');

          // set white player peerId
          this.whitePeerId = event.peer.peerId;

          // set white player wallet address
          const metadata = event.peer.getMetadata() as TPeerMetadata;
          this.whiteWalletAddress = metadata.displayName;

          // set white player cards
          this.whiteCards = [...this.generateInitialCards()];
        }

        if (this.blackPeerId && this.whitePeerId) {
          Promise.all([
            this.sendData({
              to: this.blackPeerId,
              label: 'initial-cards',
              payload: JSON.stringify(this.blackCards),
            }),
            this.sendData({
              to: this.whitePeerId,
              label: 'initial-cards',
              payload: JSON.stringify(this.whiteCards),
            }),
          ]);
        }
      } catch (error) {
        console.error('Error in new-peer-joined handler:', error);
      }
    };

    this.receiveDataHandler = (data) => {
      try {
        const { from, label, payload } = data;

        switch (label) {
          case 'ping':
            this.receivedPing(from, payload);
            break;

          case 'card-played':
            this.cardPlayed(from, JSON.parse(payload));
            break;
        }
      } catch (error) {
        console.error('Error in receive-data handler:', error);
      }
    };

    this.peerLeftHandler = (event) => {
      try {
        if (event.peerId === this.blackPeerId) {
          console.log('Black player left');
          this.blackPeerId = undefined;
          this.blackWalletAddress = undefined;
        } else if (event.peerId === this.whitePeerId) {
          console.log('White player left');
          this.whitePeerId = undefined;
          this.whiteWalletAddress = undefined;
        }

        if (!this.blackPeerId || !this.whitePeerId) this.dispose();
      } catch (error) {
        console.error('Error in peer-left handler:', error);
      }
    };

    // add the event listeners
    this.#client.room.on('new-peer-joined', this.newPeerHandler);
    this.#client.localPeer.on('receive-data', this.receiveDataHandler);
    this.#client.room.on('peer-left', this.peerLeftHandler);
  }

  // add cleanup method
  public dispose() {
    try {
      console.log('Closing room');

      if (this.newPeerHandler) {
        this.#client.room.off('new-peer-joined', this.newPeerHandler);
        this.newPeerHandler = undefined;
      }

      if (this.receiveDataHandler) {
        this.#client.localPeer.off('receive-data', this.receiveDataHandler);
        this.receiveDataHandler = undefined;
      }

      if (this.peerLeftHandler) {
        this.#client.room.off('peer-left', this.peerLeftHandler);
        this.peerLeftHandler = undefined;
      }

      this.#client.room.close();

      // clear remaining state
      this.blackPeerId = undefined;
      this.whitePeerId = undefined;
      this.blackWalletAddress = undefined;
      this.whiteWalletAddress = undefined;
      this.blackCards = [];
      this.whiteCards = [];
      this.blackActiveCard = undefined;
      this.whiteActiveCard = undefined;
      this.blackWonCards = [];
      this.whiteWonCards = [];
    } catch (error) {
      console.error('Error in dispose method:', error);
    }
  }

  private generateInitialCards() {
    const initialCards: {
      card: TCard;
      id: string;
    }[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * CARD_DECK.length);
      initialCards.push({
        card: CARD_DECK[randomIndex] as TCard,
        id: uuidv4(),
      });
    }

    return initialCards;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async receivedPing(from: string, message: string) {
    if (from === this.blackPeerId) {
      await this.sendData({
        to: this.whitePeerId,
        label: 'pong',
        payload: message,
      });
    } else if (from === this.whitePeerId) {
      await this.sendData({
        to: this.blackPeerId,
        label: 'pong',
        payload: message,
      });
    }
  }

  private async cardPlayed(
    from: string,
    {
      card,
      id,
    }: {
      card: TCard;
      id: string;
    },
  ) {
    if (from === this.blackPeerId) {
      console.log('Black played', card);
      // set the active card for black
      this.blackActiveCard = {
        card,
        id,
      };

      // if the other player has not played yet, send the redacted played card
      if (!this.whiteActiveCard) {
        this.sendData({
          to: this.whitePeerId,
          label: 'opponent-card-played',
          payload: JSON.stringify({
            card: 'redacted',
            id,
          }),
        });
      }
      // else send the actual played card
      else {
        Promise.all([
          this.sendData({
            to: this.whitePeerId,
            label: 'opponent-card-played',
            payload: JSON.stringify(this.blackActiveCard),
          }),
          this.sendData({
            to: this.blackPeerId,
            label: 'opponent-card-played',
            payload: JSON.stringify(this.whiteActiveCard),
          }),
        ]);
      }
    } else if (from === this.whitePeerId) {
      console.log('White played', card);
      // set the active card for white
      this.whiteActiveCard = {
        card,
        id,
      };

      // if the other player has not played yet, send the redacted played card
      if (!this.blackActiveCard) {
        this.sendData({
          to: this.blackPeerId,
          label: 'opponent-card-played',
          payload: JSON.stringify({
            card: 'redacted',
            id,
          }),
        });
      }
      // else send the actual played card
      else {
        Promise.all([
          this.sendData({
            to: this.blackPeerId,
            label: 'opponent-card-played',
            payload: JSON.stringify(this.whiteActiveCard),
          }),
          this.sendData({
            to: this.whitePeerId,
            label: 'opponent-card-played',
            payload: JSON.stringify(this.blackActiveCard),
          }),
        ]);
      }
    }

    if (this.blackActiveCard && this.whiteActiveCard) {
      // wait for 2 seconds before comparing cards
      await this.sleep(2000);

      // compare cards
      const blackCardSuit = this.blackActiveCard.card.slice(0, 1);
      const whiteCardSuit = this.whiteActiveCard.card.slice(0, 1);

      const blackCardValue = this.blackActiveCard.card.slice(1);
      const whiteCardValue = this.whiteActiveCard.card.slice(1);

      if (blackCardSuit === whiteCardSuit) {
        // compare values
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
    Promise.all([
      this.sendData({
        to: this.blackPeerId,
        label: 'turn-win',
        payload: JSON.stringify({
          cards: this.blackCards,
          wonCards: this.blackWonCards,
          opponentWonCards: this.whiteWonCards,
        }),
      }),
      this.sendData({
        to: this.whitePeerId,
        label: 'turn-lose',
        payload: JSON.stringify({
          cards: this.whiteCards,
          wonCards: this.whiteWonCards,
          opponentWonCards: this.blackWonCards,
        }),
      }),
    ]);
  }

  private async whiteWinsTurn() {
    console.log('White wins');

    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // add the active cards to the winner's won cards
    this.whiteWonCards.push(this.whiteActiveCard);

    // reset cards states
    this.resetCardsAfterTurn();

    // send the updated cards to the players
    Promise.all([
      this.sendData({
        to: this.whitePeerId,
        label: 'turn-win',
        payload: JSON.stringify({
          cards: this.whiteCards,
          wonCards: this.whiteWonCards,
          opponentWonCards: this.blackWonCards,
        }),
      }),
      this.sendData({
        to: this.blackPeerId,
        label: 'turn-lose',
        payload: JSON.stringify({
          cards: this.blackCards,
          wonCards: this.blackWonCards,
          opponentWonCards: this.whiteWonCards,
        }),
      }),
    ]);
  }

  private async turnDrawn() {
    console.log('Turn drawn');

    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    // reset cards states
    this.resetCardsAfterTurn();

    // send the updated cards to the players
    Promise.all([
      this.sendData({
        to: this.blackPeerId,
        label: 'turn-draw',
        payload: JSON.stringify({
          cards: this.blackCards,
          wonCards: this.blackWonCards,
          opponentWonCards: this.whiteWonCards,
        }),
      }),
      this.sendData({
        to: this.whitePeerId,
        label: 'turn-draw',
        payload: JSON.stringify({
          cards: this.whiteCards,
          wonCards: this.whiteWonCards,
          opponentWonCards: this.blackWonCards,
        }),
      }),
    ]);
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
    this.blackCards.splice(blackIndex, 0, {
      card: CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)] as TCard,
      id: uuidv4(),
    });
    this.whiteCards.splice(whiteIndex, 0, {
      card: CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)] as TCard,
      id: uuidv4(),
    });

    // reset active cards
    this.blackActiveCard = undefined;
    this.whiteActiveCard = undefined;

    // check if game is over
    this.checkGameOver();
  }

  private async checkGameOver() {
    if (this.blackWonCards.length >= 3) {
      // check if there are 3 cards with same suit or 3 cards with all different suits
      const suits = this.blackWonCards.map((card) => card.card.slice(0, 1));

      if (
        suits.filter((suit) => suit === 'A').length === 3 ||
        suits.filter((suit) => suit === 'H').length === 3 ||
        suits.filter((suit) => suit === 'S').length === 3 ||
        new Set(suits).size === 3
      ) {
        console.log('Black wins the game');

        // wait for 1 second before sending the win message
        await this.sleep(1000);

        Promise.all([
          this.sendData({
            to: this.blackPeerId,
            label: 'game-win',
            payload: 'You win!',
          }),
          this.sendData({
            to: this.whitePeerId,
            label: 'game-lose',
            payload: 'You lose!',
          }),
        ]);

        // close the room
        this.dispose();

        //TODO: update smart contract
        return;
      }
    }

    if (this.whiteWonCards.length >= 3) {
      // check if there are 3 cards with same suit or 3 cards with all different suits
      const suits = this.whiteWonCards.map((card) => card.card.slice(0, 1));

      if (
        suits.filter((suit) => suit === 'A').length === 3 ||
        suits.filter((suit) => suit === 'H').length === 3 ||
        suits.filter((suit) => suit === 'S').length === 3 ||
        new Set(suits).size === 3
      ) {
        console.log('White wins the game');

        // wait for 2 seconds before sending the win message
        await this.sleep(2000);

        Promise.all([
          this.sendData({
            to: this.whitePeerId,
            label: 'game-win',
            payload: 'You win!',
          }),
          this.sendData({
            to: this.blackPeerId,
            label: 'game-lose',
            payload: 'You lose!',
          }),
        ]);

        // close the room
        this.dispose();

        //TODO: update smart contract
        return;
      }
    }
  }

  private async sendData({
    to,
    label,
    payload,
  }: { to?: string; label: string; payload: string }) {
    if (!to) return;

    console.log('sendData called ', to, label);

    try {
      await this.#client.localPeer.sendData({
        to: [to],
        label,
        payload,
      });
    } catch (err) {
      console.error('Error sending data', err);
    }
  }
}

export { GameExecutor };
