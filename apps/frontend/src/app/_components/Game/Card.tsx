import { cn } from '@battleground/ui';
import type { TCard } from '@battleground/validators';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CARD_BG_IMAGE_MAP } from '~/app/_constants';

interface Props {
  card: { card: TCard | 'redacted'; id: string };
  onClick?: (card: TCard | 'redacted', id: string) => void;
  size: 'small' | 'medium' | 'large';
  invisible?: boolean;
}

const Card = ({ card, size, onClick, invisible }: Props) => {
  const dimensions = {
    small: { width: 96, height: 133 },
    medium: { width: 128, height: 178 },
    large: { width: 160, height: 222 },
  };

  return (
    <motion.div
      id={card.id}
      key={card.id}
      layoutId={card.id}
      className={cn(
        size === 'small' ? 'w-24 h-[133px]' : '',
        size === 'medium' ? 'w-32 h-[178px]' : '',
        size === 'large' ? 'w-40 h-[222px]' : '',
        'rounded-lg relative overflow-hidden',
        invisible ? '' : 'invisible',
        onClick ? 'cursor-pointer' : '',
      )}
      onClick={() => {
        if (onClick) {
          onClick(card.card, card.id);
        }
      }}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          <Image
            src={CARD_BG_IMAGE_MAP[card.card]}
            alt={card.card}
            width={dimensions[size].width}
            height={dimensions[size].height}
            priority={true}
            className="rounded-lg"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Card;
