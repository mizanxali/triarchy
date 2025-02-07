'use client';

import { Button } from '@battleground/ui/button';
import {
  useDataMessage,
  useLocalPeer,
  usePeerIds,
  useRoom,
} from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import { api } from '~/trpc/react';
import CardStack from './CardStack';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  const { joinRoom, state } = useRoom();
  const { peerId: localPeerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'pong') {
        alert(`Your opponent says: ${payload}`);
      }
    },
  });
  const [serverPeerId] = usePeerIds({ roles: [Role.HOST] }).peerIds;
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation();

  const joinRoomHandler = async () => {
    const token = await createAccessToken({ roomId: gameCode });

    await joinRoom({
      roomId: gameCode,
      token,
    });
  };

  const pingServerHandler = async () => {
    if (!serverPeerId) return;

    await sendData({
      to: [serverPeerId],
      label: 'ping',
      payload: 'hi bitch',
    });
  };

  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <div className="flex flex-col gap-2">
        <div>
          <div className="text-2xl font-semibold">Game Code: {gameCode}</div>
          <div className="text-base">Room State: {state}</div>
        </div>

        <div>
          <div className="text-lg">Local Peer ID: {localPeerId}</div>
          <div className="text-lg">Opponent Peer ID: {opponentPeerId}</div>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={state !== 'idle'}
            variant={'primary'}
            onClick={joinRoomHandler}
          >
            Join Room
          </Button>
          <Button
            disabled={state !== 'connected' || !serverPeerId}
            variant={'primary'}
            onClick={pingServerHandler}
          >
            Ping Server
          </Button>
        </div>
      </div>
      <div>
        <CardStack />
      </div>
    </div>
  );
};

export default GameWrapper;
