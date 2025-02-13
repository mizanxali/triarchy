import type { TCard } from '@battleground/validators';
import { v4 as uuidv4 } from 'uuid';

export const getOrderedCards = (): {
  card: TCard;
  id: string;
}[] => {
  const cards: TCard[] = [
    'A2',
    'S2',
    'H2',
    'A3',
    'S3',
    'H3',
    'A4',
    'S4',
    'H4',
    'A5',
    'S5',
    'H5',
    'A6',
    'S6',
    'H6',
    'A7',
    'S7',
    'H7',
    'A8',
    'S8',
    'H8',
    'A2',
    'S2',
    'H2',
    'A3',
    'S3',
    'H3',
    'A4',
    'S4',
    'H4',
    'A5',
    'S5',
    'H5',
    'A6',
    'S6',
    'H6',
    'A7',
    'S7',
    'H7',
    'A8',
    'S8',
    'H8',
    'A2',
    'S2',
    'H2',
    'A3',
    'S3',
    'H3',
    'A4',
    'S4',
    'H4',
    'A5',
    'S5',
    'H5',
    'A6',
    'S6',
    'H6',
    'A7',
    'S7',
    'H7',
    'A8',
    'S8',
    'H8',
  ];

  const orderedCards: {
    card: TCard;
    id: string;
  }[] = [];

  for (const card of cards) {
    orderedCards.push({
      card,
      id: uuidv4(),
    });
  }

  return orderedCards;
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};
