import Image from 'next/image';
import { CARD_BG_IMAGE_MAP } from '~/app/_constants';
import { getOrderedCards } from '~/app/utils';

const CardCarousel = () => {
  const cards = getOrderedCards();

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden bg-black/20">
      <div className="flex animate-[slide_40s_linear_infinite] h-28">
        {cards.map(({ card, id }) => (
          <div key={id} className="flex-none px-1">
            <Image
              src={CARD_BG_IMAGE_MAP[card]}
              alt={`Card ${card}`}
              width={128}
              height={178}
              priority={true}
              className="rounded-lg brightness-75"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
