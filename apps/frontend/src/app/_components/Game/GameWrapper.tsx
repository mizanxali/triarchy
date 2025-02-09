'use client';

import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';
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
        <div className="w-full flex justify-between items-center px-20 py-10">
          <Card id="my-active-card" size="large" card={activeCard} />
          <GameInfo gameCode={gameCode} />
          <Card
            id="opponent-active-card"
            size="large"
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
