'use client';

import { useRoom } from '@huddle01/react';
import React, { useEffect } from 'react';
import { api } from '~/trpc/react';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const { joinRoom, state } = useRoom();

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation();

  useEffect(() => {
    joinRoomHandler();
  }, []);

  const joinRoomHandler = async () => {
    const token = await createAccessToken({ roomId: gameCode });

    await joinRoom({
      roomId: gameCode,
      token,
    });
  };

  return (
    <div>
      <div>My Game Code: {gameCode}</div>
      <div>Room State: {state}</div>
    </div>
  );
};

export default GameWrapper;
