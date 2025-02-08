import { cn } from '@battleground/ui';
import type { TCard } from '@battleground/validators';
import { useDataMessage, usePeerIds, useRoom } from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { useGameAtom } from '~/app/_atoms/game.atom';
import { CARD_COLOR_MAP } from '~/app/_constants';

const CardStack = () => {
  const { state } = useRoom();
  const [serverPeerId] = usePeerIds({ roles: [Role.HOST] }).peerIds;
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;

  const [{ cardsDeck, wonCards }, setGameAtom] = useGameAtom();

  const { sendData } = useDataMessage();

  const onPlayCardHandler = async (card: TCard | 'redacted', id: string) => {
    if (!serverPeerId || card === 'redacted') return;

    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: prev.cardsDeck.map((cardObj) => {
        if (cardObj.id === id) {
          return {
            card: 'redacted',
            id,
          };
        }
        return cardObj;
      }),
      activeCard: card,
    }));

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
    return (
      <div className="text-lg font-medium text-center flex flex-1 items-center justify-center">
        <span>Waiting for opponent...</span>
      </div>
    );
  }

  const archers = wonCards.filter((card) => card.card.slice(0, 1) === 'A');
  const swordsmen = wonCards.filter((card) => card.card.slice(0, 1) === 'S');
  const horsemen = wonCards.filter((card) => card.card.slice(0, 1) === 'H');

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-row justify-start gap-2.5 items-end">
        {cardsDeck.map(({ card, id }) => (
          <div
            key={id}
            className={cn(
              'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
              CARD_COLOR_MAP[card],
              'transform transition-transform duration-200 ease-out hover:scale-105',
            )}
            onClick={() => onPlayCardHandler(card, id)}
          >
            {card !== 'redacted' && <span>{card}</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-end items-end gap-2.5">
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {archers.map(({ card, id }) => (
            <div
              key={id}
              className={cn(
                'w-28 h-44 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
                CARD_COLOR_MAP[card],
                'transform transition-transform duration-200 ease-out hover:scale-105',
              )}
            >
              <span>{card}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {swordsmen.map(({ card, id }) => (
            <div
              key={id}
              className={cn(
                'w-28 h-44 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
                CARD_COLOR_MAP[card],
                'transform transition-transform duration-200 ease-out hover:scale-105',
              )}
            >
              <span>{card}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {horsemen.map(({ card, id }) => (
            <div
              key={id}
              className={cn(
                'w-28 h-44 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
                CARD_COLOR_MAP[card],
                'transform transition-transform duration-200 ease-out hover:scale-105',
              )}
            >
              <span>{card}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardStack;
