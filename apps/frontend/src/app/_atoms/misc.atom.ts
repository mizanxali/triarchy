import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithReset, useResetAtom } from 'jotai/utils';

type MiscAtom = {
  showRules: boolean;
};

const defaultMiscAtom: MiscAtom = {
  showRules: false,
};

const miscAtom = atomWithReset<MiscAtom>(defaultMiscAtom);

export const useMiscAtom = () => useAtom(miscAtom);
export const useMiscAtomValue = () => useAtomValue(miscAtom);
export const useMiscSetAtom = () => useSetAtom(miscAtom);
export const useMiscResetAtom = () => useResetAtom(miscAtom);
