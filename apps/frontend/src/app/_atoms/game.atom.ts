import type { TCard } from '@battleground/validators';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';

type GameAtom = {
  cardsDeck: {
    card: TCard;
    id: string;
  }[];
  wonCards: {
    card: TCard;
    id: string;
  }[];
};

const defaultGameAtom: GameAtom = {
  cardsDeck: [],
  wonCards: [],
};

const gameAtom = atomWithReset<GameAtom>(defaultGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
export const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
