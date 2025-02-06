'use client';

import { useToast } from '@battleground/ui/hooks/useToast';
import { useModal } from 'connectkit';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  useAccount,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from 'wagmi';
import { login } from '~/app/_actions';
import {
  useGetWalletConnectorIdAtomValue,
  useResetWalletConnectorIdAtomValue,
  useSetWalletConnectorIdAtomValue,
} from '~/app/_atoms/wallet.atom';
import { api } from '~/trpc/react';
import { getSession } from 'next-auth/react';
import { hudlChain } from '@battleground/web3/client';

const useWalletConnection = (connectorId: string) => {
  const router = useRouter();
  const { open } = useModal();
  const { toast } = useToast();
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync, isSuccess } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const walletConnectorId = useGetWalletConnectorIdAtomValue();
  const setWalletConnectorIdAtomValue = useSetWalletConnectorIdAtomValue();
  const resetWalletConnectorIdAtomValue = useResetWalletConnectorIdAtomValue();
  const { mutate: generateChallenge } = api.user.generateChallenge.useMutation({
    onSuccess: async (message) => {
      if (!address) return console.log('address not found in state');

      const signature = await signMessageAsync({ account: address, message });
      const loginResponse = await login({ address, signature });

      setIsSignPending(false);

      if (loginResponse?.message) {
        await disconnectAsync();
        setIsError(true);
        // toast({
        //   icon: toastIcons['error-dark'],
        //   variant: 'error-dark',
        //   title: loginResponse.message,
        // });
      } else {
        // toast({
        //   icon: toastIcons['success-dark'],
        //   variant: 'success-dark',
        //   title: 'Successfully connected wallet',
        // });
        await switchChainAsync({ chainId: hudlChain.id });
        setIsError(false);
        const session = await getSession();
        router.refresh();
      }
      resetWalletConnectorIdAtomValue();
    },
    onError: async (error) => {
      setIsError(true);
      await handleError(error);
      setIsSignPending(false);
      resetWalletConnectorIdAtomValue();
    },
  });

  const [isError, setIsError] = useState(false);
  const [isSignPending, setIsSignPending] = useState(false);
  const [isConnectionPending, setIsConnectionPending] = useState(false);

  const handleError = useCallback(
    async (error: unknown) => {
      if (isRedirectError(error)) return;

      console.error('Signing message failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message?.split('.')[0]
          : 'Unknown error occurred';

      if (errorMessage) {
        // toast({
        //   icon: toastIcons['error-dark'],
        //   variant: 'error-dark',
        //   title: errorMessage,
        // });
        await disconnectAsync();
      }
    },
    [disconnectAsync, toast],
  );

  const signMessage = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet address not found');
    }

    setIsSignPending(true);

    generateChallenge({ walletAddress: address });
  }, [
    address,
    generateChallenge,
    signMessageAsync,
    disconnectAsync,
    toast,
    handleError,
    router,
    resetWalletConnectorIdAtomValue,
  ]);

  // Handle modal state
  useEffect(() => {
    if (!open) {
      setIsConnectionPending(false);
    }
  }, [open]);

  // Handle wallet connection
  useEffect(() => {
    if (address && walletConnectorId === connectorId) signMessage();
  }, [address, walletConnectorId, connectorId, signMessage]);

  const connectWallet = useCallback(() => {
    setWalletConnectorIdAtomValue(connectorId);
    setIsConnectionPending(true);
  }, [connectorId, setWalletConnectorIdAtomValue]);

  return {
    isError,
    isSuccess,
    isSignPending,
    isWalletConnecting: isConnectionPending,
    connectWallet,
  };
};

export default useWalletConnection;
