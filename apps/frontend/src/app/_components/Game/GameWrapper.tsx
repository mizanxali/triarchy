'use client';

import { cn } from '@battleground/ui';
import type { TCard } from '@battleground/validators';
import { useDataMessage, useRoom } from '@huddle01/react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useGameAtom } from '~/app/_atoms/game.atom';
import { CARD_COLOR_MAP } from '~/app/_constants';
import CardStack from './CardStack';
import GameInfo from './GameInfo';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const router = useRouter();

  const [{ activeCard, opponentActiveCard }, setGameAtom] = useGameAtom();

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

  useRoom({
    onPeerLeft: () => {
      alert('Opponent left the game');
      router.push('/');
    },
  });

  useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'initial-cards') {
        onInitialCardsReceived(JSON.parse(payload));
      } else if (label === 'turn-win') {
        console.log('You won the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-lose') {
        console.log('You lost the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-draw') {
        console.log('It was a draw!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'opponent-card-played') {
        onOpponentCardPlayed(payload as TCard);
      } else if (label === 'game-win') {
        alert('You won the game!');
        router.push('/');
      } else if (label === 'game-lose') {
        alert('You lost the game!');
        router.push('/');
      }
    },
  });

  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center">
          <div
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              activeCard ? CARD_COLOR_MAP[activeCard] : 'invisible',
            )}
          >
            <span>{activeCard}</span>
          </div>
          <GameInfo gameCode={gameCode} />
          <div
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              opponentActiveCard
                ? CARD_COLOR_MAP[opponentActiveCard]
                : 'invisible',
            )}
          >
            {opponentActiveCard !== 'redacted' && (
              <span>{opponentActiveCard}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <CardStack />
      </div>
    </div>
  );
};

export default GameWrapper;
