import React from 'react';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
import { AnimatePresence } from 'motion/react';

const ActiveCards = () => {
  const [{ activeCard, opponentActiveCard }] = useGameAtom();

  return (
    <div className="flex-1 w-full flex justify-between items-center py-10">
      <div className="flex-1 flex justify-end items-center px-20">
        <div className="flex-1 flex flex-col justify-center items-start gap-2">
          <div className="text-yellow-600 text-3xl font-bold">You</div>
          {/* <div className="text-lg font-medium">{metadata?.displayName}</div> */}
        </div>
        <AnimatePresence mode="wait">
          {activeCard ? (
            <Card size="medium" card={activeCard} />
          ) : (
            <Card
              size="medium"
              card={{
                card: 'redacted',
                id: '404',
              }}
              invisible
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex justify-start items-center px-20">
        <AnimatePresence mode="wait">
          {opponentActiveCard ? (
            <Card size="medium" card={opponentActiveCard} />
          ) : (
            <Card
              size="medium"
              card={{ card: 'redacted', id: '404_opponent' }}
              invisible
            />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col justify-center items-end gap-2">
          <div className="text-yellow-600 text-3xl font-bold">Opponent</div>
          {/* <RemotePeerInfo remotePeerId={opponentPeerId} /> */}
        </div>
      </div>
    </div>
  );
};

export default ActiveCards;
