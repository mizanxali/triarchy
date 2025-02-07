'use client';

import { Button } from '@battleground/ui/button';
import { useLocalPeer, usePeerIds, useRoom } from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const router = useRouter();

  const { joinRoom, state, closeRoom } = useRoom();
  const { peerId: localPeerId } = useLocalPeer();

  const { peerIds: botRemotePeerIds } = usePeerIds({
    roles: [Role.HOST],
  });
  const botPeerId = botRemotePeerIds[0];

  const { peerIds: playerRemotePeerIds } = usePeerIds({
    roles: [Role.GUEST],
  });
  const opponentPeerId = playerRemotePeerIds[0];

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation();

  // useEffect(() => {
  //   joinRoomHandler();
  // }, []);

  const joinRoomHandler = async () => {
    const token = await createAccessToken({ roomId: gameCode });

    await joinRoom({
      roomId: gameCode,
      token,
    });
  };

  const closeRoomHandler = () => {
    closeRoom();
    router.push('/');
  };

  return (
    <div>
      <div>My Game Code: {gameCode}</div>
      <div>Room State: {state}</div>
      <div>Local Peer ID: {localPeerId}</div>
      <div>Opponent Peer ID: {opponentPeerId}</div>
      <div>Bot Peer ID: {botPeerId}</div>
      <Button
        disabled={state !== 'idle'}
        variant={'primary'}
        onClick={joinRoomHandler}
      >
        Join Room
      </Button>
      <Button
        disabled={state !== 'connected'}
        variant={'destructive'}
        onClick={closeRoomHandler}
      >
        Close Room
      </Button>
    </div>
  );
};

export default GameWrapper;
