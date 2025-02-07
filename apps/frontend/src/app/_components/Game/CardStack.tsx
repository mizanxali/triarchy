import { useDataMessage, usePeerIds, useRoom } from '@huddle01/react';
import { useState } from 'react';
import type { TCard } from '@battleground/validators';
import { cn } from '@battleground/ui';
import { CARD_COLOR_MAP } from '~/app/_constants';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@huddle01/server-sdk/auth';
import { useGameAtom } from '~/app/_atoms/game.atom';

const CardStack = () => {
  const { state } = useRoom();
  const [serverPeerId] = usePeerIds({ roles: [Role.HOST] }).peerIds;
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;

  // const [cards, setCards] = useState<
  //   {
  //     card: TCard;
  //     id: string;
  //   }[]
  // >([]);

  const [gameAtom, setGameAtom] = useGameAtom();

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
    }));
  };

  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'initial-cards') {
        onInitialCardsReceived(JSON.parse(payload));
      } else if (label === 'turn-win') {
        alert('You won the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-lose') {
        alert('You lost the turn!');
        onTurnOver(JSON.parse(payload));
      } else if (label === 'turn-draw') {
        alert('It was a draw!');
        onTurnOver(JSON.parse(payload));
      }
    },
  });

  const onPlayCardHandler = async (card: TCard) => {
    if (!serverPeerId) return;

    await sendData({
      to: [serverPeerId],
      label: 'card-played',
      payload: card,
    });
  };

  if (state !== 'connected') {
    return null;
  }

  if (!opponentPeerId) {
    return <div className="text-lg font-medium">Waiting for opponent...</div>;
  }

  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
        {gameAtom.cardsDeck.map(({ card, id }) => (
          <div
            key={id}
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              CARD_COLOR_MAP[card],
              'transform transition-transform duration-200 ease-out hover:scale-105',
            )}
            onClick={() => onPlayCardHandler(card)}
          >
            <span>{card}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardStack;
