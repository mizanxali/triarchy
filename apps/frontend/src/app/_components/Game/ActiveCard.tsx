import { cn } from '@battleground/ui';
import { useGameAtomValue } from '~/app/_atoms/game.atom';
import { CARD_COLOR_MAP } from '~/app/_constants';

const ActiveCard = () => {
  const { activeCard, opponentActiveCard } = useGameAtomValue();

  return (
    <div className="w-full flex justify-between items-center">
      <div
        className={cn(
          'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
          activeCard ? CARD_COLOR_MAP[activeCard] : 'invisible',
        )}
      >
        <span>{activeCard}</span>
      </div>

      <div
        className={cn(
          'w-36 h-56 cursor-pointer rounded-lg text-black text-3xl font-bold flex items-center justify-center',
          opponentActiveCard ? CARD_COLOR_MAP[opponentActiveCard] : 'invisible',
        )}
      >
        {opponentActiveCard !== 'redacted' && <span>{opponentActiveCard}</span>}
      </div>
    </div>
  );
};

export default ActiveCard;
