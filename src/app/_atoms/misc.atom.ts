import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';

type MiscAtom = {
  showRules: boolean;
  showLeaderboard: boolean;
  showGameOver: boolean;
  gameOverMessage: string;
  txnHash?: string;
  isWinner: boolean;
};

const defaultMiscAtom: MiscAtom = {
  showRules: false,
  showLeaderboard: false,
  showGameOver: false,
  gameOverMessage: '',
  txnHash: undefined,
  isWinner: false,
};

const miscAtom = atomWithReset<MiscAtom>(defaultMiscAtom);

export const useMiscAtom = () => useAtom(miscAtom);
const useMiscAtomValue = () => useAtomValue(miscAtom);
export const useMiscSetAtom = () => useSetAtom(miscAtom);
const useMiscResetAtom = () => useResetAtom(miscAtom);
