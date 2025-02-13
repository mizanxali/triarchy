'use client';

import React from 'react';
import { useMobile } from '~/app/_hooks/useMobile';
import Root from './Root';
import { useSession } from 'next-auth/react';
import WalletConnect from '../Button/WalletConnect';
import { OctagonAlert } from 'lucide-react';
import { Loader } from '@battleground/ui/loader';
import Rules from '../common/Rules';
import { useGameAtom } from '~/app/_atoms/game.atom';

const MobileChecker = () => {
  const { isMobile, isLoading } = useMobile();
  const { data: session, status } = useSession();
  const [{ gameCode }] = useGameAtom();

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

  return (
    <>
      {gameCode ? null : (
        <div className="fixed top-8 right-8 z-20">
          <Rules />
        </div>
      )}
      {session ? (
        <Root walletAddress={session.user.walletAddress} />
      ) : (
        <div className="w-1/2 mx-auto text-center h-screen flex flex-col items-center">
          <h1 className="text-9xl uppercase mt-20 text-yellow-600">
            Triumvirate
          </h1>
          <div className="text-3xl mt-16">
            Master the trinity of combat in this tactical card game where
            superior numbers meet strategic counters in a battle for supremacy.
          </div>
          <div className="text-2xl mt-16 mb-8">
            Connect your wallet to get started.
          </div>
          <WalletConnect />
        </div>
      )}
    </>
  );
};

export default MobileChecker;
