import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { nanoid } from 'nanoid';
import type PartySocket from 'partysocket';
import type { TCard } from '~/lib/validators';

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
  opponentWalletAddress?: string;
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
  opponentWalletAddress: undefined,
};

const dummyGameAtom: GameAtom = {
  gameCode: 'xxf-bvgv-ydn',
  partySocket: null,
  cardsDeck: [
    {
      card: 'A2',
      id: nanoid(),
    },
    {
      card: 'S3',
      id: nanoid(),
    },
    {
      card: 'H4',
      id: nanoid(),
    },
    {
      card: 'A5',
      id: nanoid(),
    },
    {
      card: 'H7',
      id: nanoid(),
    },
  ],
  wonCards: [
    {
      card: 'A2',
      id: nanoid(),
    },
    {
      card: 'S3',
      id: nanoid(),
    },
    {
      card: 'H4',
      id: nanoid(),
    },
    {
      card: 'A5',
      id: nanoid(),
    },
    {
      card: 'H7',
      id: nanoid(),
    },
    {
      card: 'A2',
      id: nanoid(),
    },
    {
      card: 'S3',
      id: nanoid(),
    },
  ],
  opponentWonCards: [
    {
      card: 'A2',
      id: nanoid(),
    },
    {
      card: 'S3',
      id: nanoid(),
    },
  ],
  activeCard: {
    card: 'A2',
    id: nanoid(),
  },
  opponentActiveCard: {
    card: 'redacted',
    id: nanoid(),
  },
  isPlayable: false,
  opponentWalletAddress: '0x1234567890123456789012345678901234567890',
};

const gameAtom = atomWithReset<GameAtom>(defaultGameAtom);

export const useGameAtom = () => useAtom(gameAtom);
export const useGameAtomValue = () => useAtomValue(gameAtom);
const useGameSetAtom = () => useSetAtom(gameAtom);
export const useGameResetAtom = () => useResetAtom(gameAtom);
