'use client';

import { Button } from '@battleground/ui/button';
import { Input } from '@battleground/ui/input';
import React, { useState } from 'react';
import SignOutTile from '../Navigation/Header/Profile/SignOutTile';
import { api } from '~/trpc/react';
import { useRoom } from '@huddle01/react';
import { useGameSetAtom } from '~/app/_atoms/game.atom';

interface Props {
  walletAddress: string;
  joinRoom: (data: { roomId: string; token: string }) => void;
}

const Welcome = ({ walletAddress, joinRoom }: Props) => {
  const [gameCode, setGameCode] = useState('');

  const { mutateAsync, isPending } = api.room.createRoom.useMutation({
    onSuccess: async (roomId) => {
      setGameCode(roomId);
      await createAccessToken({ roomId });
    },
  });

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation({
      onSuccess: async (token) => {
        await joinRoom({
          roomId: gameCode,
          token,
        });
      },
    });

  return (
    <div className="w-full h-screen flex flex-col gap-2 justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-center w-1/3">
        <h3 className="text-zinc-200 text-base font-medium">
          Welcome, {walletAddress}
        </h3>
        <Button
          disabled={isPending}
          onClick={async () => {
            await mutateAsync();
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
          onClick={async () => {
            await createAccessToken({ roomId: gameCode });
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
