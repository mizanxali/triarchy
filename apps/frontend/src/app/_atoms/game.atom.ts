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

const gameAtom = atomWithReset<GameAtom>(defaultGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
export const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
