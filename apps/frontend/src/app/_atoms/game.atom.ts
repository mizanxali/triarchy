import type { TCard } from '@battleground/validators';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import type PartySocket from 'partysocket';
import { v4 as uuidv4 } from 'uuid';

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
  activeCard?: {
    card: TCard;
    id: string;
  };
  opponentActiveCard?: {
    card: TCard | 'redacted';
    id: string;
  };
  isPlayable: boolean;
  partySocket: PartySocket | null;
};

const defaultGameAtom: GameAtom = {
  gameCode: undefined,
  cardsDeck: [],
  wonCards: [],
  opponentWonCards: [],
  activeCard: undefined,
  opponentActiveCard: undefined,
  isPlayable: false,
  partySocket: null,
};

const dummyGameAtom: GameAtom = {
  gameCode: 'xxf-bvgv-ydn',
  partySocket: null,
  cardsDeck: [
    {
      card: 'A2',
      id: uuidv4(),
    },
    {
      card: 'S3',
      id: uuidv4(),
    },
    {
      card: 'H4',
      id: uuidv4(),
    },
    {
      card: 'A5',
      id: uuidv4(),
    },
    {
      card: 'H7',
      id: uuidv4(),
    },
  ],
  wonCards: [
    {
      card: 'A2',
      id: uuidv4(),
    },
    {
      card: 'S3',
      id: uuidv4(),
    },
    {
      card: 'H4',
      id: uuidv4(),
    },
    {
      card: 'A5',
      id: uuidv4(),
    },
    {
      card: 'H7',
      id: uuidv4(),
    },
    {
      card: 'A2',
      id: uuidv4(),
    },
    {
      card: 'S3',
      id: uuidv4(),
    },
  ],
  opponentWonCards: [
    {
      card: 'A2',
      id: uuidv4(),
    },
    {
      card: 'S3',
      id: uuidv4(),
    },
  ],
  activeCard: {
    card: 'A2',
    id: uuidv4(),
  },
  opponentActiveCard: {
    card: 'redacted',
    id: uuidv4(),
  },
  isPlayable: false,
};

const gameAtom = atomWithReset<GameAtom>(defaultGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
