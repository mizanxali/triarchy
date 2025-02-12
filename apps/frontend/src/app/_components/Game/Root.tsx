'use client';

import { useDataMessage, useRoom } from '@huddle01/react';
import Welcome from '../Home/Welcome';
import GameWrapper from './GameWrapper';
import { useGameAtom, useGameResetAtom } from '~/app/_atoms/game.atom';
import type { TCard } from '@battleground/validators';

interface Props {
  walletAddress: string;
}

const Root = ({ walletAddress }: Props) => {
  const [{ gameCode }, setGameAtom] = useGameAtom();
  const resetGameAtom = useGameResetAtom();

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
      resetGameAtom();
      closeRoom();
    },
    onPeerLeft: () => {
      alert('Opponent left the game');
      resetGameAtom();
      closeRoom();
    },
  });

  const onInitialCardsReceived = (cards: { card: TCard; id: string }[]) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards,
    }));
  };

  const onOpponentCardPlayed = (card: { card: TCard; id: string }) => {
    setGameAtom((prev) => ({
      ...prev,
      opponentActiveCard: card,
    }));
  };

  const onTurnWin = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards,
      wonCards: wonCards,
      opponentWonCards: opponentWonCards,
      activeCard: undefined,
      opponentActiveCard: undefined,
    }));
  };

  const onTurnLose = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards,
      wonCards: wonCards,
      opponentWonCards: opponentWonCards,
      activeCard: undefined,
      opponentActiveCard: undefined,
    }));
  };

  const onTurnDraw = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: cards,
      wonCards: wonCards,
      opponentWonCards: opponentWonCards,
      activeCard: undefined,
      opponentActiveCard: undefined,
    }));
  };

  const onGameOver = () => {
    resetGameAtom();
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
        onOpponentCardPlayed(JSON.parse(payload));
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
