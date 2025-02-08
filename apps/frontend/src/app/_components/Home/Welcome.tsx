'use client';

import { Button } from '@battleground/ui/button';
import { Input } from '@battleground/ui/input';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignOutTile from '../Navigation/Header/Profile/SignOutTile';
import { api } from '~/trpc/react';

interface Props {
  walletAddress: string;
}

const Welcome = ({ walletAddress }: Props) => {
  const router = useRouter();

  const [gameCode, setGameCode] = useState('');

  const { mutateAsync, isPending } = api.room.createRoom.useMutation();

  return (
    <div className="w-full h-screen flex flex-col gap-2 justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-center w-1/3">
        <h3 className="text-zinc-200 text-base font-medium">
          Welcome, {walletAddress}
        </h3>
        <Button
          disabled={isPending}
          onClick={async () => {
            const roomId = await mutateAsync();
            router.push(`/play/${roomId}`);
          }}
          variant={'primary'}
        >
          {isPending ? 'Creating Game...' : 'Create Game'}
        </Button>
        <h6>OR</h6>
        <Input
          className="w-3/4"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          placeholder="Enter Game Code"
        />
        <Button
          disabled={!gameCode}
          onClick={() => {
            router.push(`/play/${gameCode}`);
          }}
          variant={'primary'}
        >
          Join Game
        </Button>
        <SignOutTile />
      </div>
    </div>
  );
};

export default Welcome;
