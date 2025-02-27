'use client';

import { hudlChain } from '~/lib/web3/client';
import { useAppKitState } from '@reown/appkit/react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  useAccount,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from 'wagmi';
import { generateLoginChallenge, login } from '~/app/_actions';
import {
  useGetWalletConnectorIdAtomValue,
  useResetWalletConnectorIdAtomValue,
  useSetWalletConnectorIdAtomValue,
} from '~/app/_atoms/wallet.atom';

const useWalletConnection = (connectorId: string) => {
  const router = useRouter();
  const { open } = useAppKitState();
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync, isSuccess } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const walletConnectorId = useGetWalletConnectorIdAtomValue();
  const setWalletConnectorIdAtomValue = useSetWalletConnectorIdAtomValue();
  const resetWalletConnectorIdAtomValue = useResetWalletConnectorIdAtomValue();

  const [isError, setIsError] = useState(false);
  const [isSignPending, setIsSignPending] = useState(false);
  const [isConnectionPending, setIsConnectionPending] = useState(false);

  const handleError = useCallback(
    async (error: unknown) => {
      console.error('Signing message failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message?.split('.')[0]
          : 'Unknown error occurred';

      if (errorMessage) {
        await disconnectAsync();
      }
    },
    [disconnectAsync],
  );

  const signMessage = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet address not found');
    }

    setIsSignPending(true);

    try {
      // Get challenge token and message
      const { token, message } = await generateLoginChallenge(address);

      // Sign the message
      const signature = await signMessageAsync({
        account: address,
        message,
      });

      // Login with signature and token
      const loginResponse = await login({
        address,
        signature,
        token,
      });

      setIsSignPending(false);

      if (loginResponse?.message) {
        await disconnectAsync();
        setIsError(true);
      } else {
        await switchChainAsync({ chainId: hudlChain.id });
        setIsError(false);
        await getSession();
        router.refresh();
      }
      resetWalletConnectorIdAtomValue();
    } catch (error) {
      setIsError(true);
      await handleError(error);
      setIsSignPending(false);
      resetWalletConnectorIdAtomValue();
    }
  }, [
    address,
    signMessageAsync,
    disconnectAsync,
    handleError,
    router,
    resetWalletConnectorIdAtomValue,
    switchChainAsync,
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
