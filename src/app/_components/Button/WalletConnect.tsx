'use client';

import { cn } from '~/components/ui';
import { Button } from '~/components/ui/button';
import { useAppKit, useAppKitState } from '@reown/appkit/react';
import { memo, useId, useMemo } from 'react';
import useWalletConnection from '~/app/_hooks/useWalletConnection';
import { WalletMinimal, Loader } from 'lucide-react';

interface WalletConnectProps {
  className?: string;
  text?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className, text }) => {
  const connectorId = useId();
  const { open } = useAppKit();
  const { loading } = useAppKitState();
  const {
    isError,
    isSuccess,
    isSignPending,
    isWalletConnecting,
    connectWallet,
  } = useWalletConnection(connectorId);

  const buttonState = useMemo(() => {
    if (isWalletConnecting)
      return { icon: <Loader />, title: 'Connecting Wallet' };
    if (isSignPending) return { icon: <Loader />, title: 'Signing Message' };
    if (isSuccess)
      return {
        icon: <WalletMinimal />,
        title: isError ? 'Connect Wallet' : 'Connected !',
      };
    return { icon: <WalletMinimal />, title: text ?? 'Connect Wallet' };
  }, [isWalletConnecting, isSignPending, isSuccess, isError, text]);

  return (
    <Button
      disabled={loading || isSignPending || isWalletConnecting}
      variant="primary"
      className={cn(
        'flex items-center justify-center hover:bg-zinc-200',
        className,
      )}
      onClick={() => {
        open();
        connectWallet();
      }}
    >
      <div className="flex items-center gap-2">
        <span>{buttonState.icon}</span>
        <div>{buttonState.title}</div>
      </div>
    </Button>
  );
};

export default memo(WalletConnect);
