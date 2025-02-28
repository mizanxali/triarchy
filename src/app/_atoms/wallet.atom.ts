import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

const walletConnectorId = atomWithReset<string>('');

export const useGetWalletConnectorIdAtomValue = () =>
  useAtomValue(walletConnectorId);

export const useSetWalletConnectorIdAtomValue = () =>
  useSetAtom(walletConnectorId);

const useWalletConnectorIdAtomValue = () => useAtom(walletConnectorId);

export const useResetWalletConnectorIdAtomValue = () =>
  useResetAtom(walletConnectorId);
