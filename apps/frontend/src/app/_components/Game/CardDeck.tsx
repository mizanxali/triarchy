import type { TCard } from '@battleground/validators';
import { useDataMessage, usePeerIds, useRoom } from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';

const CardDeck = () => {
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
      activeCard: {
        card,
        id,
      },
    }));

    await sendData({
      to: [serverPeerId],
      label: 'card-played',
      payload: JSON.stringify({
        card,
        id,
      }),
    });
  };

  if (state !== 'connected' || !opponentPeerId) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-row justify-start gap-2.5 items-end">
        {cardsDeck.map((card) => {
          return (
            <Card
              key={card.id}
              card={card}
              onClick={() => onPlayCardHandler(card.card, card.id)}
              size="medium"
              invisible={card.card === 'redacted'}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardDeck;
