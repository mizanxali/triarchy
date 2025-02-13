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
const useMiscAtomValue = () => useAtomValue(miscAtom);
const useMiscSetAtom = () => useSetAtom(miscAtom);
const useMiscResetAtom = () => useResetAtom(miscAtom);
