import type { TCard } from '@battleground/validators';
import type * as Party from 'partykit/server';
import { nanoid } from 'nanoid';

export const CARD_DECK: TCard[] = [
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'H7',
  'H8',
];

interface GameState {
  gameCode: string;
  blackCards: Array<{ card: TCard; id: string }>;
  whiteCards: Array<{ card: TCard; id: string }>;
  blackActiveCard?: { card: TCard; id: string };
  whiteActiveCard?: { card: TCard; id: string };
  blackWonCards: Array<{ card: TCard; id: string }>;
  whiteWonCards: Array<{ card: TCard; id: string }>;
  wagerAmount: string;
  blackPeerId?: string;
  whitePeerId?: string;
  isGameOver: boolean;
  winner?: 'black' | 'white';
}

export default class Server implements Party.Server {
  private state: GameState;

  constructor(readonly room: Party.Room) {
    this.state = {
      gameCode: room.id, // Use room ID as game code
      blackCards: [],
      whiteCards: [],
      blackActiveCard: undefined,
      whiteActiveCard: undefined,
      blackWonCards: [],
      whiteWonCards: [],
      wagerAmount: '',
      blackPeerId: undefined,
      whitePeerId: undefined,
      isGameOver: false,
      winner: undefined,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    if (!this.state.blackPeerId) {
      this.state.blackPeerId = conn.id;

      if (this.state.blackCards.length === 0) {
        this.state.blackCards = this.generateInitialCards();
      }

      conn.send(
        JSON.stringify({
          type: 'initial-cards',
          data: { cards: this.state.blackCards, gameCode: this.state.gameCode },
        }),
      );
    } else if (!this.state.whitePeerId && conn.id !== this.state.blackPeerId) {
      this.state.whitePeerId = conn.id;

      if (this.state.whiteCards.length === 0) {
        this.state.whiteCards = this.generateInitialCards();
      }

      conn.send(
        JSON.stringify({
          type: 'initial-cards',
          data: { cards: this.state.whiteCards, gameCode: this.state.gameCode },
        }),
      );
    }
  }

  private generateInitialCards() {
    const initialCards: { card: TCard; id: string }[] = [];
    const usedIndices = new Set<number>();

    while (initialCards.length < 5) {
      const randomIndex = Math.floor(Math.random() * CARD_DECK.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        initialCards.push({
          card: CARD_DECK[randomIndex] as TCard,
          id: nanoid(),
        });
      }
    }

    return initialCards;
  }

  private evaluateCards(card1: TCard, card2: TCard): 'win' | 'lose' | 'draw' {
    const type1 = card1[0];
    const type2 = card2[0];
    const value1 = Number.parseInt(card1.slice(1));
    const value2 = Number.parseInt(card2.slice(1));

    if (type1 === type2)
      return value1 > value2 ? 'win' : value1 < value2 ? 'lose' : 'draw';

    if (type1 === 'A' && type2 === 'H') return 'win';
    if (type1 === 'H' && type2 === 'S') return 'win';
    if (type1 === 'S' && type2 === 'A') return 'win';

    return 'lose';
  }

  private checkGameOver() {
    if (this.state.blackWonCards.length >= 3) {
      const suits = this.state.blackWonCards.map((card) =>
        card.card.slice(0, 1),
      );

      if (
        suits.filter((suit) => suit === 'A').length >= 3 ||
        suits.filter((suit) => suit === 'H').length >= 3 ||
        suits.filter((suit) => suit === 'S').length >= 3 ||
        new Set(suits).size >= 3
      ) {
        this.state.isGameOver = true;
        this.state.winner = 'black';
        return true;
      }
    }

    if (this.state.whiteWonCards.length >= 3) {
      const suits = this.state.whiteWonCards.map((card) =>
        card.card.slice(0, 1),
      );

      if (
        suits.filter((suit) => suit === 'A').length >= 3 ||
        suits.filter((suit) => suit === 'H').length >= 3 ||
        suits.filter((suit) => suit === 'S').length >= 3 ||
        new Set(suits).size >= 3
      ) {
        this.state.isGameOver = true;
        this.state.winner = 'white';
        return true;
      }
    }

    return false;
  }

  private resetCardsAfterTurn() {
    if (!this.state.blackActiveCard || !this.state.whiteActiveCard) {
      return;
    }

    const blackIndex = this.state.blackCards.findIndex(
      (card) => card.id === this.state.blackActiveCard?.id,
    );
    const whiteIndex = this.state.whiteCards.findIndex(
      (card) => card.id === this.state.whiteActiveCard?.id,
    );

    if (blackIndex !== -1) {
      this.state.blackCards.splice(blackIndex, 1);
    }

    if (whiteIndex !== -1) {
      this.state.whiteCards.splice(whiteIndex, 1);
    }

    const newBlackCard = CARD_DECK[
      Math.floor(Math.random() * CARD_DECK.length)
    ] as TCard;
    const newWhiteCard = CARD_DECK[
      Math.floor(Math.random() * CARD_DECK.length)
    ] as TCard;

    this.state.blackCards.splice(blackIndex, 0, {
      card: newBlackCard,
      id: nanoid(),
    });

    this.state.whiteCards.splice(whiteIndex, 0, {
      card: newWhiteCard,
      id: nanoid(),
    });

    this.state.blackActiveCard = undefined;
    this.state.whiteActiveCard = undefined;
  }

  async onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'card-played': {
        const isBlackPlayer = sender.id === this.state.blackPeerId;
        const card = data.data.card;
        const id = data.data.id;

        if (isBlackPlayer) {
          this.state.blackActiveCard = { card, id };

          if (this.state.whitePeerId) {
            this.room.getConnection(this.state.whitePeerId)?.send(
              JSON.stringify({
                type: 'opponent-card-played',
                data: {
                  card: 'redacted',
                  id,
                },
              }),
            );
          }
        } else {
          this.state.whiteActiveCard = { card, id };

          if (this.state.blackPeerId) {
            this.room.getConnection(this.state.blackPeerId)?.send(
              JSON.stringify({
                type: 'opponent-card-played',
                data: {
                  card: 'redacted',
                  id,
                },
              }),
            );
          }
        }

        if (this.state.blackActiveCard && this.state.whiteActiveCard) {
          if (this.state.blackPeerId) {
            this.room.getConnection(this.state.blackPeerId)?.send(
              JSON.stringify({
                type: 'opponent-card-played',
                data: this.state.whiteActiveCard,
              }),
            );
          }

          if (this.state.whitePeerId) {
            this.room.getConnection(this.state.whitePeerId)?.send(
              JSON.stringify({
                type: 'opponent-card-played',
                data: this.state.blackActiveCard,
              }),
            );
          }

          await this.sleep(2000);

          const result = this.evaluateCards(
            this.state.blackActiveCard.card,
            this.state.whiteActiveCard.card,
          );

          if (result === 'win') {
            this.state.blackWonCards.push(this.state.blackActiveCard);
            this.resetCardsAfterTurn();
            this.sendTurnResults('win', 'lose');
          } else if (result === 'lose') {
            this.state.whiteWonCards.push(this.state.whiteActiveCard);
            this.resetCardsAfterTurn();
            this.sendTurnResults('lose', 'win');
          } else {
            this.resetCardsAfterTurn();
            this.sendTurnResults('draw', 'draw');
          }

          if (this.checkGameOver()) {
            this.sendGameOverMessages();
          }
        }
        break;
      }
    }
  }

  private sendTurnResults(
    blackResult: 'win' | 'lose' | 'draw',
    whiteResult: 'win' | 'lose' | 'draw',
  ) {
    if (this.state.blackPeerId) {
      this.room.getConnection(this.state.blackPeerId)?.send(
        JSON.stringify({
          type: `turn-${blackResult}`,
          data: {
            cards: this.state.blackCards,
            wonCards: this.state.blackWonCards,
            opponentWonCards: this.state.whiteWonCards,
          },
        }),
      );
    }

    if (this.state.whitePeerId) {
      this.room.getConnection(this.state.whitePeerId)?.send(
        JSON.stringify({
          type: `turn-${whiteResult}`,
          data: {
            cards: this.state.whiteCards,
            wonCards: this.state.whiteWonCards,
            opponentWonCards: this.state.blackWonCards,
          },
        }),
      );
    }
  }

  private async sendGameOverMessages() {
    if (this.state.isGameOver && this.state.winner) {
      await this.sleep(1000);

      if (this.state.winner === 'black' && this.state.blackPeerId) {
        this.room.getConnection(this.state.blackPeerId)?.send(
          JSON.stringify({
            type: 'game-win',
            data: {
              message: 'You win!',
            },
          }),
        );
      }

      if (this.state.winner === 'white' && this.state.whitePeerId) {
        this.room.getConnection(this.state.whitePeerId)?.send(
          JSON.stringify({
            type: 'game-win',
            data: {
              message: 'You win!',
            },
          }),
        );
      }

      if (this.state.winner === 'black' && this.state.whitePeerId) {
        this.room.getConnection(this.state.whitePeerId)?.send(
          JSON.stringify({
            type: 'game-lose',
            data: {
              message: 'You lose!',
            },
          }),
        );
      }

      if (this.state.winner === 'white' && this.state.blackPeerId) {
        this.room.getConnection(this.state.blackPeerId)?.send(
          JSON.stringify({
            type: 'game-lose',
            data: {
              message: 'You lose!',
            },
          }),
        );
      }
    }
  }

  async onClose(connection: Party.Connection) {
    if (connection.id === this.state.blackPeerId) {
      this.state.blackPeerId = undefined;

      if (this.state.whitePeerId) {
        this.state.isGameOver = true;
        this.state.winner = 'white';

        this.room.getConnection(this.state.whitePeerId)?.send(
          JSON.stringify({
            type: 'game-win',
            data: {
              message: 'Opponent disconnected. You win!',
            },
          }),
        );
      }
    } else if (connection.id === this.state.whitePeerId) {
      this.state.whitePeerId = undefined;

      if (this.state.blackPeerId) {
        this.state.isGameOver = true;
        this.state.winner = 'black';

        this.room.getConnection(this.state.blackPeerId)?.send(
          JSON.stringify({
            type: 'game-win',
            data: {
              message: 'Opponent disconnected. You win!',
            },
          }),
        );
      }
    }
  }
}

Server satisfies Party.Worker;
