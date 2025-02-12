import { cn } from '@battleground/ui';
import type { TCard } from '@battleground/validators';
import Image from 'next/image';
import { CARD_BG_IMAGE_MAP } from '~/app/_constants';

interface Props {
  id: string;
  card?: TCard | 'redacted';
  onClick?: (card: string, id: string) => void;
  size: 'small' | 'medium' | 'large';
}

const Card = ({ id, card, size, onClick }: Props) => {
  const dimensions = {
    small: { width: 96, height: 133 },
    medium: { width: 128, height: 178 },
    large: { width: 160, height: 222 },
  };

  return (
    <div
      id={id}
      key={id}
      className={cn(
        size === 'small' ? 'w-24 h-[133px]' : '',
        size === 'medium' ? 'w-32 h-[178px]' : '',
        size === 'large' ? 'w-40 h-[222px]' : '',
        'rounded-lg relative overflow-hidden',
        card ? '' : 'invisible',
        onClick
          ? 'cursor-pointer transform transition-transform duration-200 ease-out hover:scale-105'
          : '',
      )}
      onClick={() => {
        if (card && onClick) {
          onClick(card, id);
        }
      }}
    >
      {card && (
        <Image
          src={CARD_BG_IMAGE_MAP[card]}
          alt={`Card ${id}`}
          width={dimensions[size].width}
          height={dimensions[size].height}
          priority={true}
          className="rounded-lg"
        />
      )}
    </div>
  );
};

export default Card;
