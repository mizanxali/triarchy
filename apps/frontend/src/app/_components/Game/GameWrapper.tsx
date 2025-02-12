'use client';

import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
import CardStack from './CardStack';
import WinningCardStacks from './WinningCardStacks';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const [{ activeCard, opponentActiveCard }] = useGameAtom();

  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <WinningCardStacks gameCode={gameCode} />
      <div className="flex-1 w-full flex justify-between items-center py-10">
        <div className="flex-1 flex justify-end items-center px-20">
          <Card id="my-active-card" size="medium" card={activeCard} />
        </div>

        <div className="flex-1 flex justify-start items-center px-20">
          <Card
            id="opponent-active-card"
            size="medium"
            card={opponentActiveCard}
          />
        </div>
      </div>
      <div>
        <CardStack />
      </div>
    </div>
  );
};

export default GameWrapper;
