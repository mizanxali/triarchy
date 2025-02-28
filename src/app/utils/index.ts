import type { TCard } from '~/lib/validators';
import { customAlphabet, nanoid } from 'nanoid';

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
      id: nanoid(),
    });
  }

  return orderedCards;
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const generateGameCode = () => {
  const a = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);
  const text = a();
  const textLength = text.length;
  const textPart1 = text.substring(0, textLength / 3);
  const textPart2 = text.substring(textLength / 3, (textLength / 3) * 2 + 1);
  const textPart3 = text.substring((textLength / 3) * 2 + 1, textLength);
  return `${textPart1}-${textPart2}-${textPart3}`;
};
