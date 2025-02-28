import React from 'react';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
import type { TCard } from '~/lib/validators';
import GameInfo from './GameInfo';

const WinningCardStacks = () => {
  const [{ wonCards, opponentWonCards }, setGameAtom] = useGameAtom();

  const myArchers = wonCards.filter((card) => card.card.slice(0, 1) === 'A');
  const mySwordsmen = wonCards.filter((card) => card.card.slice(0, 1) === 'S');
  const myHorsemen = wonCards.filter((card) => card.card.slice(0, 1) === 'H');

  const opponentArchers = opponentWonCards.filter(
    (card) => card.card.slice(0, 1) === 'A',
  );
  const opponentSwordsmen = opponentWonCards.filter(
    (card) => card.card.slice(0, 1) === 'S',
  );
  const opponentHorsemen = opponentWonCards.filter(
    (card) => card.card.slice(0, 1) === 'H',
  );

  const renderStack = (cards: { card: TCard; id: string }[]) => (
    <div className="relative">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute top-0"
          style={{
            top: `${index * 30}px`,
            zIndex: index,
          }}
        >
          <Card card={card} size="small" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-row justify-between items-start h-48">
      <div className="flex flex-row justify-end items-start gap-2">
        <div className="w-24">{renderStack(myArchers)}</div>
        <div className="w-24">{renderStack(mySwordsmen)}</div>
        <div className="w-24">{renderStack(myHorsemen)}</div>
      </div>

      <GameInfo />

      <div className="flex flex-row justify-end items-start gap-2">
        <div className="w-24">{renderStack(opponentHorsemen)}</div>
        <div className="w-24">{renderStack(opponentSwordsmen)}</div>
        <div className="w-24">{renderStack(opponentArchers)}</div>
      </div>
    </div>
  );
};

export default WinningCardStacks;
