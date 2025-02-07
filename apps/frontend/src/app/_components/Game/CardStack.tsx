import { useDataMessage, usePeerIds } from '@huddle01/react';
import { useState } from 'react';
import type { TCard } from '@battleground/validators';
import { cn } from '@battleground/ui';
import { CARD_COLOR_MAP } from '~/app/_constants';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@huddle01/server-sdk/auth';

const CardStack = () => {
  const [serverPeerId] = usePeerIds({ roles: [Role.HOST] }).peerIds;

  const [cards, setCards] = useState<
    {
      card: TCard;
      id: string;
    }[]
  >([]);

  const onCardsReceived = (cards: TCard[]) => {
    setCards(
      cards.map((card) => ({
        card,
        id: uuidv4(),
      })),
    );
  };

  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'initial-cards') {
        onCardsReceived(JSON.parse(payload));
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

  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
        {cards.map(({ card, id }) => (
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
