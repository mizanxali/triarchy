import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithStorage, useResetAtom } from 'jotai/utils';

const musicEnabledAtom = atomWithStorage('musicEnabled', true);

export const useMusicAtom = () => useAtom(musicEnabledAtom);
const useMusicAtomValue = () => useAtomValue(musicEnabledAtom);
const useMusicSetAtom = () => useSetAtom(musicEnabledAtom);
const useMusicResetAtom = () => useResetAtom(musicEnabledAtom);
