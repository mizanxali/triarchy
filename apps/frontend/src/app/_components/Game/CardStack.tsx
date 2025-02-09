import type { TCard } from '@battleground/validators';
import { useDataMessage, usePeerIds, useRoom } from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';

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

  if (state !== 'connected' || !opponentPeerId) {
    return null;
  }

  const archers = wonCards.filter((card) => card.card.slice(0, 1) === 'A');
  const swordsmen = wonCards.filter((card) => card.card.slice(0, 1) === 'S');
  const horsemen = wonCards.filter((card) => card.card.slice(0, 1) === 'H');

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-row justify-start gap-2.5 items-end">
        {cardsDeck.map(({ card, id }) => (
          <Card
            key={id}
            id={id}
            card={card}
            onClick={() => onPlayCardHandler(card, id)}
            size="medium"
          />
        ))}
      </div>

      <div className="flex flex-row justify-end items-end gap-2.5">
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {archers.map(({ card, id }) => (
            <Card
              key={id}
              id={id}
              card={card}
              onClick={() => onPlayCardHandler(card, id)}
              size="small"
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {swordsmen.map(({ card, id }) => (
            <Card
              key={id}
              id={id}
              card={card}
              onClick={() => onPlayCardHandler(card, id)}
              size="small"
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 items-center justify-end">
          {horsemen.map(({ card, id }) => (
            <Card
              key={id}
              id={id}
              card={card}
              onClick={() => onPlayCardHandler(card, id)}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardStack;
