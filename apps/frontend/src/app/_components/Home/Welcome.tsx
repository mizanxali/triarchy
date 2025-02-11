'use client';

import { Button } from '@battleground/ui/button';
import { Input } from '@battleground/ui/input';
import React, { useState } from 'react';
import { api } from '~/trpc/react';
import SignOutButton from '../common/SignOutButton';

interface Props {
  walletAddress: string;
  joinRoom: (data: { roomId: string; token: string }) => Promise<unknown>;
}

const Welcome = ({ walletAddress, joinRoom }: Props) => {
  const [createdGameCode, setCreatedGameCode] = useState('');
  const [gameCode, setGameCode] = useState('');

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const { mutateAsync } = api.room.createRoom.useMutation({
    onSuccess: async (roomId) => {
      setCreatedGameCode(roomId);
      await createAccessToken({ roomId });
    },
  });

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation({
      onSuccess: async (token) => {
        const roomId = createdGameCode.length > 0 ? createdGameCode : gameCode;
        if (roomId.length === 0) return;
        await joinRoom({
          roomId,
          token,
        });
        setIsCreatingGame(false);
        setIsJoiningGame(false);
      },
    });

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-6 justify-center items-center w-1/2">
        <h3 className="text-zinc-200 text-4xl font-medium text-center">
          Welcome {walletAddress}
        </h3>
        <div className="w-full grid grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <Button
              disabled={isCreatingGame}
              onClick={async () => {
                setIsCreatingGame(true);
                await mutateAsync();
              }}
              variant={'primary'}
            >
              {isCreatingGame ? 'Creating Game...' : 'Create Game'}
            </Button>
          </div>
          <div className="flex-1 border-l-2 border-gray-600 flex flex-col items-center gap-4 p-4 w-full">
            <Input
              className="w-3/4"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter Game Code"
            />
            <Button
              disabled={!gameCode || isJoiningGame}
              onClick={async () => {
                setIsJoiningGame(true);
                await createAccessToken({ roomId: gameCode });
              }}
              variant={'primary'}
            >
              Join Game
            </Button>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
};

export default Welcome;
