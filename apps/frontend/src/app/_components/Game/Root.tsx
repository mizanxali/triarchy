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
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: false,
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
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: true,
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
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: true,
    }));
  };

  const onGameOver = () => {
    resetGameAtom();
    closeRoom();
  };

  useDataMessage({
    onMessage: (payload, from, label) => {
      const parsedPayload = JSON.parse(payload);
      if (label === 'initial-cards') {
        onInitialCardsReceived(parsedPayload);
      } else if (label === 'turn-win') {
        console.log('You won the turn!', parsedPayload);
        onTurnWin(parsedPayload);
      } else if (label === 'turn-lose') {
        console.log('You lost the turn!', parsedPayload);
        onTurnLose(parsedPayload);
      } else if (label === 'turn-draw') {
        console.log('It was a draw!', parsedPayload);
        onTurnDraw(parsedPayload);
      } else if (label === 'opponent-card-played') {
        console.log('Opponent card played!', parsedPayload);
        onOpponentCardPlayed(parsedPayload);
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
