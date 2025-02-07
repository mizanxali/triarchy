'use client';

import { Button } from '@battleground/ui/button';
import {
  useDataMessage,
  useLocalPeer,
  usePeerIds,
  useRoom,
} from '@huddle01/react';
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

  const { sendData } = useDataMessage();

  const { peerIds: hostRemotePeerIds } = usePeerIds({
    roles: [Role.HOST],
  });
  const serverPeerId = hostRemotePeerIds[0];

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

  const pingServerHandler = async () => {
    if (!serverPeerId) return;

    await sendData({
      to: [serverPeerId],
      label: 'ping',
      payload: 'hello server',
    });
  };

  return (
    <div>
      <div>My Game Code: {gameCode}</div>
      <div>Room State: {state}</div>
      <div>Local Peer ID: {localPeerId}</div>
      <div>Opponent Peer ID: {opponentPeerId}</div>
      <div>Bot Peer ID: {serverPeerId}</div>
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
      <Button
        disabled={state !== 'connected' || !serverPeerId}
        variant={'primary'}
        onClick={pingServerHandler}
      >
        Ping Server
      </Button>
    </div>
  );
};

export default GameWrapper;
