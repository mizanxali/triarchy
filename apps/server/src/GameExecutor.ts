import { db } from '@battleground/db/client';
import { User } from '@battleground/db/schema';
import type { TCard, TPeerMetadata } from '@battleground/validators';
import { eq } from '@battleground/db';
import type { HuddleClient } from '@huddle01/web-core';
import { CARD_DECK } from './constants';

class GameExecutor {
  #client: HuddleClient;

  blackWalletAddress: string | undefined;
  whiteWalletAddress: string | undefined;

  blackPeerId: string | undefined;
  whitePeerId: string | undefined;

  blackCards: TCard[] = [];
  whiteCards: TCard[] = [];

  blackActiveCard: TCard | undefined;
  whiteActiveCard: TCard | undefined;

  blackWonCards: TCard[] = [];
  whiteWonCards: TCard[] = [];

  constructor(client: HuddleClient) {
    this.#client = client;

    this.#client.room.on('new-peer-joined', (event) => {
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
        this.blackWalletAddress = undefined;
      } else if (event.peerId === this.whitePeerId) {
        console.log('White player left');
        this.whitePeerId = undefined;
        this.whiteWalletAddress = undefined;
      }

      if (!this.blackPeerId || !this.whitePeerId) {
        console.log('Closing room');
        this.#client.room.close();
      }
    });
  }

  private generateInitialCards() {
    const initialCards: TCard[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * CARD_DECK.length);
      initialCards.push(CARD_DECK[randomIndex] as TCard);
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

  private async cardPlayed(from: string, card: TCard) {
    if (from === this.blackPeerId) {
      console.log('Black played', card);
      // set the active card for black
      this.blackActiveCard = card;

      // if the other player has not played yet, send the redacted played card
      if (!this.whiteActiveCard) {
        this.sendData({
          to: this.whitePeerId,
          label: 'opponent-card-played',
          payload: 'redacted',
        });
      }
      // else send the actual played card
      else {
        Promise.all([
          this.sendData({
            to: this.whitePeerId,
            label: 'opponent-card-played',
            payload: card,
          }),
          this.sendData({
            to: this.blackPeerId,
            label: 'opponent-card-played',
            payload: this.whiteActiveCard,
          }),
        ]);
      }
    } else if (from === this.whitePeerId) {
      console.log('White played', card);
      // set the active card for white
      this.whiteActiveCard = card;

      // if the other player has not played yet, send the redacted played card
      if (!this.blackActiveCard) {
        this.sendData({
          to: this.blackPeerId,
          label: 'opponent-card-played',
          payload: 'redacted',
        });
      }
      // else send the actual played card
      else {
        Promise.all([
          this.sendData({
            to: this.blackPeerId,
            label: 'opponent-card-played',
            payload: card,
          }),
          this.sendData({
            to: this.whitePeerId,
            label: 'opponent-card-played',
            payload: this.blackActiveCard,
          }),
        ]);
      }
    }

    if (this.blackActiveCard && this.whiteActiveCard) {
      // wait for 2 seconds before comparing cards
      await this.sleep(2000);

      // compare cards
      const blackCardSuit = this.blackActiveCard.slice(0, 1);
      const whiteCardSuit = this.whiteActiveCard.slice(0, 1);

      const blackCardValue = this.blackActiveCard.slice(1);
      const whiteCardValue = this.whiteActiveCard.slice(1);

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
        }),
      }),
      this.sendData({
        to: this.whitePeerId,
        label: 'turn-lose',
        payload: JSON.stringify({
          cards: this.whiteCards,
          wonCards: this.whiteWonCards,
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
        }),
      }),
      this.sendData({
        to: this.blackPeerId,
        label: 'turn-lose',
        payload: JSON.stringify({
          cards: this.blackCards,
          wonCards: this.blackWonCards,
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
        }),
      }),
      this.sendData({
        to: this.whitePeerId,
        label: 'turn-draw',
        payload: JSON.stringify({
          cards: this.whiteCards,
          wonCards: this.whiteWonCards,
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

    // check if game is over
    this.checkGameOver();
  }

  private async checkGameOver() {
    if (this.blackWonCards.length >= 3) {
      // check if there are 3 cards with same suit or 3 cards with all different suits
      const suits = this.blackWonCards.map((card) => card.slice(0, 1));

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
        this.#client.room.close();

        // update the database
        await Promise.all([
          this.updatePlayerStats(true, this.blackWalletAddress),
          this.updatePlayerStats(false, this.whiteWalletAddress),
        ]);

        return;
      }
    }

    if (this.whiteWonCards.length >= 3) {
      // check if there are 3 cards with same suit or 3 cards with all different suits
      const suits = this.whiteWonCards.map((card) => card.slice(0, 1));

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
        this.#client.room.close();

        // update the database
        await Promise.all([
          this.updatePlayerStats(true, this.whiteWalletAddress),
          this.updatePlayerStats(false, this.blackWalletAddress),
        ]);

        return;
      }
    }
  }

  private async updatePlayerStats(didWin: boolean, walletAddress?: string) {
    if (!walletAddress) return;

    try {
      const user = await db.query.User.findFirst({
        where: (user, { eq }) => eq(user.walletAddress, walletAddress),
      });

      if (user) {
        await db
          .update(User)
          .set({
            gamesWon: didWin ? user.gamesWon + 1 : user.gamesWon,
            gamesLost: didWin ? user.gamesLost : user.gamesLost + 1,
          })
          .where(eq(User.walletAddress, walletAddress));
      }
    } catch (err) {
      console.error(err);
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
