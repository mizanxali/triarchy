'use client';

import { useDataMessage, useRoom } from '@huddle01/react';
import Welcome from '../Home/Welcome';
import GameWrapper from './GameWrapper';
import { useGameAtom } from '~/app/_atoms/game.atom';
import { v4 as uuidv4 } from 'uuid';
import type { TCard } from '@battleground/validators';

interface Props {
  walletAddress: string;
}

const Root = ({ walletAddress }: Props) => {
  const [{ gameCode }, setGameAtom] = useGameAtom();

  const { joinRoom, closeRoom } = useRoom({
    onJoin: ({ room }) => {
      if (room.roomId) {
        setGameAtom((prev) => ({
          ...prev,
          gameCode: room.roomId as string,
        }));
      }
    },
    onLeave: (data) => {
      if (data.reason === 'MAX_PEERS_REACHED') alert('Game is full');
      setGameAtom((prev) => ({
        ...prev,
        gameCode: undefined,
      }));
      closeRoom();
    },
    onPeerLeft: () => {
      alert('Opponent left the game');
      setGameAtom((prev) => ({
        ...prev,
        gameCode: undefined,
      }));
      closeRoom();
    },
  });

  const onInitialCardsReceived = (cards: TCard[]) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards.map((card) => ({
        card,
        id: uuidv4(),
      })),
    }));
  };

  const onTurnOver = ({
    cards,
    wonCards,
  }: { cards: TCard[]; wonCards: TCard[] }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards.map((card) => ({
        card,
        id: uuidv4(),
      })),
      wonCards: wonCards.map((card) => ({
        card,
        id: uuidv4(),
      })),
      activeCard: undefined,
      opponentActiveCard: undefined,
    }));
  };

  const onOpponentCardPlayed = (card: TCard) => {
    setGameAtom((prev) => ({
      ...prev,
      opponentActiveCard: card,
    }));
  };

  const onTurnWin = (data: { cards: TCard[]; wonCards: TCard[] }) => {
    // // fade out opponent active card
    // const element = document.getElementById('opponent-active-card');
    // if (element) {
    //   if (element.style.transform === 'scale(0)') {
    //     element.style.transform = 'scale(1)';
    //   } else {
    //     element.style.transform = 'scale(0)';
    //   }
    // }
    // setTimeout(() => {
    onTurnOver(data);
    // }, 3000);
  };

  const onTurnLose = (data: { cards: TCard[]; wonCards: TCard[] }) => {
    // fade out your active card
    // const element = document.getElementById('my-active-card');
    // if (element) {
    //   if (element.style.transform === 'scale(0)') {
    //     element.style.transform = 'scale(1)';
    //   } else {
    //     element.style.transform = 'scale(0)';
    //   }
    // }
    // setTimeout(() => {
    onTurnOver(data);
    // }, 3000);
  };

  const onTurnDraw = (data: { cards: TCard[]; wonCards: TCard[] }) => {
    // fade out both active cards
    // const element1 = document.getElementById('my-active-card');
    // if (element1) {
    //   if (element1.style.transform === 'scale(0)') {
    //     element1.style.transform = 'scale(1)';
    //   } else {
    //     element1.style.transform = 'scale(0)';
    //   }
    // }
    // const element2 = document.getElementById('opponent-active-card');
    // if (element2) {
    //   if (element2.style.transform === 'scale(0)') {
    //     element2.style.transform = 'scale(1)';
    //   } else {
    //     element2.style.transform = 'scale(0)';
    //   }
    // }
    // setTimeout(() => {
    onTurnOver(data);
    // }, 3000);
  };

  const onGameOver = () => {
    setGameAtom((prev) => ({
      ...prev,
      gameCode: undefined,
    }));
    closeRoom();
  };

  useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'initial-cards') {
        onInitialCardsReceived(JSON.parse(payload));
      } else if (label === 'turn-win') {
        console.log('You won the turn!');
        onTurnWin(JSON.parse(payload));
      } else if (label === 'turn-lose') {
        console.log('You lost the turn!');
        onTurnLose(JSON.parse(payload));
      } else if (label === 'turn-draw') {
        console.log('It was a draw!');
        onTurnDraw(JSON.parse(payload));
      } else if (label === 'opponent-card-played') {
        onOpponentCardPlayed(payload as TCard);
      } else if (label === 'game-win') {
        alert('You won the game!');
        onGameOver();
      } else if (label === 'game-lose') {
        alert('You lost the game!');
        onGameOver();
      }
    },
  });

  if (!gameCode)
    return <Welcome walletAddress={walletAddress} joinRoom={joinRoom} />;

  return <GameWrapper gameCode={gameCode} />;
};

export default Root;
