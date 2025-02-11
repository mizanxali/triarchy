import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { atomWithStorage, useResetAtom } from 'jotai/utils';

const musicEnabledAtom = atomWithStorage('musicEnabled', true);

export const useMusicAtom = () => useAtom(musicEnabledAtom);
export const useMusicAtomValue = () => useAtomValue(musicEnabledAtom);
export const useMusicSetAtom = () => useSetAtom(musicEnabledAtom);
export const useMusicResetAtom = () => useResetAtom(musicEnabledAtom);
