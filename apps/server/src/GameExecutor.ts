import type { TCard, TPeerMetadata } from '@battleground/validators';
import type { HuddleClient } from '@huddle01/web-core';
import type { LocalPeerEvents, RoomEvents } from '@huddle01/web-core/types';
import { CARD_DECK } from './constants';
import { v4 as uuidv4 } from 'uuid';
import {
  getAccountFromPrivateKey,
  walletClient,
} from '@battleground/web3/client';
import { GameWagerABI } from '@battleground/web3/abis';
import { GAME_WAGER_ADDRESS } from '@battleground/web3/constants';

class GameExecutor {
  #client: HuddleClient;

  gameCode: string | undefined;
  wagerAmount: string | undefined;

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

  constructor(client: HuddleClient, gameCode: string, wagerAmount: string) {
    console.log(
      'GameExecutor created with gameCode and wagerAmount',
      gameCode,
      wagerAmount,
    );

    this.#client = client;
    this.gameCode = gameCode;
    this.wagerAmount = wagerAmount;

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

    this.peerLeftHandler = ({ peerId }) => {
      try {
        console.log('Player left', peerId);

        let compensatedPlayer = undefined;

        if (this.whitePeerId && peerId === this.blackPeerId) {
          compensatedPlayer = this.whiteWalletAddress;
        } else if (this.blackPeerId && peerId === this.whitePeerId) {
          compensatedPlayer = this.blackWalletAddress;
        }

        console.log('Compensated player', compensatedPlayer);

        if (compensatedPlayer) this.cancelGame(compensatedPlayer);
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
      this.gameCode = undefined;
      this.wagerAmount = undefined;
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
        payload: JSON.stringify({
          message,
        }),
      });
    } else if (from === this.whitePeerId) {
      await this.sendData({
        to: this.blackPeerId,
        label: 'pong',
        payload: JSON.stringify({
          message,
        }),
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

  private resetCardsAfterTurn() {
    if (!this.blackActiveCard || !this.whiteActiveCard) return;

    const blackIndex = this.blackCards.findIndex(
      (card) => card.id === this.blackActiveCard?.id,
    );
    const whiteIndex = this.whiteCards.findIndex(
      (card) => card.id === this.whiteActiveCard?.id,
    );

    if (blackIndex === -1 || whiteIndex === -1) {
      console.error('Active card not found in player hands');
      return;
    }

    if (CARD_DECK.length === 0) {
      console.error('No cards left in deck');
      return;
    }

    const newBlackCard = CARD_DECK[
      Math.floor(Math.random() * CARD_DECK.length)
    ] as TCard;
    const newWhiteCard = CARD_DECK[
      Math.floor(Math.random() * CARD_DECK.length)
    ] as TCard;

    console.log('New black card', newBlackCard);
    console.log('New white card', newWhiteCard);

    this.blackCards.splice(blackIndex, 1);
    this.whiteCards.splice(whiteIndex, 1);

    this.blackCards.splice(blackIndex, 0, {
      card: newBlackCard,
      id: uuidv4(),
    });
    this.whiteCards.splice(whiteIndex, 0, {
      card: newWhiteCard,
      id: uuidv4(),
    });

    this.blackActiveCard = undefined;
    this.whiteActiveCard = undefined;

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
            payload: JSON.stringify({
              message: 'You win!',
            }),
          }),
          this.sendData({
            to: this.whitePeerId,
            label: 'game-lose',
            payload: JSON.stringify({
              message: 'You lose!',
            }),
          }),
        ]);

        // call the completeGame function on the smart contract
        if (this.wagerAmount && this.gameCode) {
          const adminPrivateKey = process.env.GAME_ADMIN_PRIVATE_KEY;

          const adminAccount = getAccountFromPrivateKey(
            adminPrivateKey as `0x${string}`,
          );

          const txnHash = await walletClient.writeContract({
            account: adminAccount,
            abi: GameWagerABI,
            address: GAME_WAGER_ADDRESS,
            functionName: 'completeGame',
            args: [this.gameCode, this.blackWalletAddress as `0x${string}`],
          });

          console.log('Black player rewarded:', txnHash);
        }

        // close the room
        this.dispose();

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
            payload: JSON.stringify({
              message: 'You win!',
            }),
          }),
          this.sendData({
            to: this.blackPeerId,
            label: 'game-lose',
            payload: JSON.stringify({
              message: 'You lose!',
            }),
          }),
        ]);

        // call the completeGame function on the smart contract
        if (this.wagerAmount && this.gameCode) {
          const adminPrivateKey = process.env.GAME_ADMIN_PRIVATE_KEY;

          const adminAccount = getAccountFromPrivateKey(
            adminPrivateKey as `0x${string}`,
          );

          const txnHash = await walletClient.writeContract({
            account: adminAccount,
            abi: GameWagerABI,
            address: GAME_WAGER_ADDRESS,
            functionName: 'completeGame',
            args: [this.gameCode, this.whiteWalletAddress as `0x${string}`],
          });

          console.log('White player rewarded', txnHash);
        }

        // close the room
        this.dispose();

        return;
      }
    }
  }

  private async cancelGame(compensatedPlayer: string) {
    // call the cancelGame function on the smart contract
    if (this.gameCode) {
      const adminPrivateKey = process.env.GAME_ADMIN_PRIVATE_KEY;

      const adminAccount = getAccountFromPrivateKey(
        adminPrivateKey as `0x${string}`,
      );

      const txnHash = await walletClient.writeContract({
        account: adminAccount,
        abi: GameWagerABI,
        address: GAME_WAGER_ADDRESS,
        functionName: 'cancelGame',
        args: [this.gameCode, compensatedPlayer as `0x${string}`],
      });

      console.log('Game canceled', txnHash);
    }

    // close the room
    this.dispose();
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
