import type { TCard } from '~/lib/validators';
import { useGameAtom } from '~/app/_atoms/game.atom';
import Card from './Card';

const CardDeck = () => {
  const [{ cardsDeck, isPlayable, partySocket }, setGameAtom] = useGameAtom();

  const onPlayCardHandler = async (card: TCard | 'redacted', id: string) => {
    if (card === 'redacted' || !isPlayable) return;

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
      isPlayable: false,
    }));

    if (partySocket) {
      partySocket.send(
        JSON.stringify({
          type: 'card-played',
          data: { card, id },
        }),
      );
    }
  };

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
