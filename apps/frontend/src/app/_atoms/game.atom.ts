import type { TCard } from '@battleground/validators';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';

type GameAtom = {
  gameCode?: string;
  cardsDeck: {
    card: TCard | 'redacted';
    id: string;
  }[];
  wonCards: {
    card: TCard;
    id: string;
  }[];
  opponentWonCards: {
    card: TCard;
    id: string;
  }[];
  activeCard?: TCard;
  opponentActiveCard?: TCard | 'redacted';
};

const defaultGameAtom: GameAtom = {
  gameCode: undefined,
  cardsDeck: [],
  wonCards: [],
  opponentWonCards: [],
  activeCard: undefined,
  opponentActiveCard: undefined,
};

const dummyGameAtom: GameAtom = {
  gameCode: 'xxf-bvgv-ydn',
  cardsDeck: [
    {
      card: 'A2',
      id: '1',
    },
    {
      card: 'S3',
      id: '2',
    },
    {
      card: 'H4',
      id: '3',
    },
    {
      card: 'A5',
      id: '4',
    },
    {
      card: 'H7',
      id: '6',
    },
  ],
  wonCards: [
    {
      card: 'A2',
      id: '1',
    },
    {
      card: 'S3',
      id: '2',
    },
    {
      card: 'H4',
      id: '3',
    },
    {
      card: 'A5',
      id: '4',
    },
    {
      card: 'H7',
      id: '6',
    },
    {
      card: 'A2',
      id: '7',
    },
    {
      card: 'S3',
      id: '8',
    },
  ],
  opponentWonCards: [
    {
      card: 'A2',
      id: '1',
    },
    {
      card: 'S3',
      id: '2',
    },
  ],
  activeCard: 'A2',
  opponentActiveCard: 'redacted',
};

const gameAtom = atomWithReset<GameAtom>(dummyGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
export const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
