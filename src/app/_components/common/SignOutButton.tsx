'use client';

import { Button } from '~/components/ui/button';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDisconnect } from '@reown/appkit/react';
import { logout } from '~/app/_actions';
import { LogOut } from 'lucide-react';

const SignOutButton = () => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { disconnect: disconnectAsync } = useDisconnect();
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
        prefixIcon={<LogOut />}
      >
        {isDisconnecting ? 'Signing Out...' : 'Sign Out'}
      </Button>
    </div>
  );
};

export default SignOutButton;
