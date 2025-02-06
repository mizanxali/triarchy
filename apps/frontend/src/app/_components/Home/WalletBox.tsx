'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import WalletConnect from '../Button/WalletConnect';
import SignOutTile from '../Navigation/Header/Profile/SignOutTile';

const WalletBox = () => {
  const { status, data } = useSession();

  if (status !== 'authenticated') return <WalletConnect />;

  return (
    <div>
      {data.user.walletAddress}
      <SignOutTile />
    </div>
  );
};

export default WalletBox;
