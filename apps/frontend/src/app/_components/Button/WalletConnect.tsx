'use client';

import { cn } from '@battleground/ui';
import { Button } from '@battleground/ui/button';
import { Skeleton } from '@battleground/ui/skeleton';
import { ConnectKitButton, useIsMounted, useModal } from 'connectkit';
import { memo, useId, useMemo } from 'react';
import useWalletConnection from '~/app/_hooks/useWalletConnection';

interface WalletConnectProps {
  className?: string;
  text?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className, text }) => {
  const connectorId = useId();
  const isMounted = useIsMounted();
  const {
    isError,
    isSuccess,
    isSignPending,
    isWalletConnecting,
    connectWallet,
  } = useWalletConnection(connectorId);

  const buttonState = useMemo(() => {
    if (isWalletConnecting)
      return { icon: undefined, title: 'Connecting Wallet' };
    if (isSignPending) return { icon: undefined, title: 'Signing Message' };
    if (isSuccess)
      return {
        icon: undefined,
        title: isError ? 'Connect Wallet' : 'Connected !',
      };
    return { icon: undefined, title: text ?? 'Connect Wallet' };
  }, [isWalletConnecting, isSignPending, isSuccess, isError, text]);

  if (!isMounted) return <Skeleton className={cn('w-40 h-8', className)} />;

  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <Button
          disabled={isSignPending || isWalletConnecting}
          variant="primary"
          className={cn(
            'flex items-center justify-center hover:bg-zinc-200',
            className,
          )}
          onClick={() => {
            connectWallet();
            show?.();
          }}
        >
          <div className="flex items-center gap-2">
            <span>{buttonState.icon}</span>
            <div>{buttonState.title}</div>
          </div>
        </Button>
      )}
    </ConnectKitButton.Custom>
  );
};

export default memo(WalletConnect);
