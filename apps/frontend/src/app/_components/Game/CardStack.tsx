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

  const [{ cardsDeck }, setGameAtom] = useGameAtom();

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
    return <div className="text-lg font-medium">Waiting for opponent...</div>;
  }

  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
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
            <span>{card}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardStack;
