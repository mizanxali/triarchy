'use client';

import { Button } from '@battleground/ui/button';
import { ExitIcon } from '@radix-ui/react-icons';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';
import { logout } from '~/app/_actions';

const SignOutButton = () => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();

  const disconnect = async () => {
    setIsDisconnecting(true);
    await disconnectAsync();
    await logout();
    await getSession();
    router.refresh();
  };

  return (
    <div className="px-1.5 my-2">
      <Button
        variant="destructive"
        disabled={isDisconnecting}
        onClick={disconnect}
        prefixIcon={<ExitIcon />}
      >
        {isDisconnecting ? 'Signing Out...' : 'Sign Out'}
      </Button>
    </div>
  );
};

export default SignOutButton;
