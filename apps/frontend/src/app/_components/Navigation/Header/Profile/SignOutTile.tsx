'use client';

import { ExitIcon } from '@radix-ui/react-icons';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';
import { logout } from '~/app/_actions';

const SignOutTile = () => {
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
      <div
        onClick={() => disconnect()}
        onKeyDown={() => disconnect()}
        role="button"
        tabIndex={0}
        className="flex w-full space-x-2 rounded-lg hover:bg-zinc-700/50 items-center"
      >
        <ExitIcon className="text-red-400" />
        <div className="text-red-400 text-sm">
          {isDisconnecting ? 'Signing Out...' : 'Sign Out'}
        </div>
      </div>
    </div>
  );
};

export default SignOutTile;
