import React from 'react';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
import { AnimatePresence } from 'motion/react';

const ActiveCards = () => {
  const [{ activeCard, opponentActiveCard }] = useGameAtom();

  return (
    <div className="flex-1 w-full flex justify-between items-center py-10">
      <div className="flex-1 flex justify-end items-center px-20">
        <AnimatePresence mode="wait">
          {activeCard && <Card size="medium" card={activeCard} />}
        </AnimatePresence>
      </div>
      <div className="flex-1 flex justify-start items-center px-20">
        <AnimatePresence mode="wait">
          {opponentActiveCard && (
            <Card size="medium" card={opponentActiveCard} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActiveCards;
