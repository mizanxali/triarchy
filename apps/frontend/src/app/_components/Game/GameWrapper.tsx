'use client';

import { cn } from '@battleground/ui';

import { useGameAtom } from '~/app/_atoms/game.atom';
import { CARD_COLOR_MAP } from '~/app/_constants';
import CardStack from './CardStack';
import GameInfo from './GameInfo';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const [{ activeCard, opponentActiveCard }] = useGameAtom();

  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center">
          <div
            id="my-active-card"
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center transition-all duration-150 ease-in-out',
              activeCard ? CARD_COLOR_MAP[activeCard] : 'invisible',
            )}
          >
            <span>{activeCard}</span>
          </div>

          <GameInfo gameCode={gameCode} />

          <div
            id="opponent-active-card"
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center transition-all duration-150 ease-in-out',
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
