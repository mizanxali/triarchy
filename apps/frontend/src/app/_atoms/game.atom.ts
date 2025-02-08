import type { TCard } from '@battleground/validators';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';

type GameAtom = {
  cardsDeck: {
    card: TCard | 'redacted';
    id: string;
  }[];
  wonCards: {
    card: TCard;
    id: string;
  }[];
  activeCard?: TCard;
  opponentActiveCard?: TCard | 'redacted';
};

const defaultGameAtom: GameAtom = {
  cardsDeck: [],
  wonCards: [],
  activeCard: undefined,
  opponentActiveCard: undefined,
};

const dummyGameAtom: GameAtom = {
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
  ],
  activeCard: 'A2',
  opponentActiveCard: 'redacted',
};

const gameAtom = atomWithReset<GameAtom>(defaultGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
export const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
