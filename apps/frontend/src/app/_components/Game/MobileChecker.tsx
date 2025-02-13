'use client';

import React from 'react';
import { useMobile } from '~/app/_hooks/useMobile';
import Root from './Root';
import { useSession } from 'next-auth/react';
import WalletConnect from '../Button/WalletConnect';
import { OctagonAlert } from 'lucide-react';
import { Loader } from '@battleground/ui/loader';

const MobileChecker = () => {
  const { isMobile, isLoading } = useMobile();
  const { data: session, status } = useSession();

  if (isLoading || status === 'loading')
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="large" />
      </div>
    );

  if (isMobile)
    return (
      <div className="w-full h-screen flex flex-col gap-3 justify-center items-center text-center px-10 text-lg">
        <OctagonAlert className="text-yellow-600 w-16 h-16" />
        <div>This game is currently optimized for desktop use only.</div>
        <div>
          For the best experience, please access the platform from a computer or
          laptop.
        </div>
      </div>
    );

  if (!session)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <WalletConnect />
      </div>
    );

  return <Root walletAddress={session.user.walletAddress} />;
};

export default MobileChecker;
