import { cn } from '@battleground/ui';
import type { TCard } from '@battleground/validators';
import Image from 'next/image';
import { CARD_BG_IMAGE_MAP } from '~/app/_constants';

interface Props {
  id: string;
  card?: TCard | 'redacted';
  onClick?: (card: string, id: string) => void;
  size?: 'small' | 'medium' | 'large';
}

const Card = ({ id, card, size = 'large', onClick }: Props) => {
  const dimensions = {
    small: { width: 128, height: 128 }, // w-32 h-32
    medium: { width: 160, height: 160 }, // w-40 h-40
    large: { width: 192, height: 192 }, // w-48 h-48
  };

  return (
    <div
      id={id}
      key={id}
      className={cn(
        size === 'small' ? 'w-32 h-32' : '',
        size === 'medium' ? 'w-40 h-40' : '',
        size === 'large' ? 'w-48 h-48' : '',
        'cursor-pointer rounded-lg relative overflow-hidden',
        card ? '' : 'invisible',
        'transform transition-transform duration-200 ease-out hover:scale-105',
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
