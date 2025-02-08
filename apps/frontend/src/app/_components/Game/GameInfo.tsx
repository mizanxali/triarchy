import type { TPeerMetadata } from '@battleground/validators';
import {
  useLocalPeer,
  usePeerIds,
  useRemotePeer,
  useRoom,
} from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';

interface Props {
  gameCode: string;
}

const GameInfo = ({ gameCode }: Props) => {
  const { metadata } = useLocalPeer<TPeerMetadata>();
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;
  const { state } = useRoom();

  return (
    <div className="flex flex-col gap-2 text-center items-center">
      <div>
        <div className="text-2xl font-semibold">Game Code: {gameCode}</div>
        <div className="text-base">Room State: {state}</div>
      </div>
      <div>
        <div className="text-lg">You: {metadata?.displayName}</div>
        {opponentPeerId ? (
          <RemotePeerInfo remotePeerId={opponentPeerId} />
        ) : (
          <div className="text-lg font-medium">
            <span>Waiting for opponent...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo;

const RemotePeerInfo = ({
  remotePeerId,
}: {
  remotePeerId: string;
}) => {
  const { metadata: remotePeerMetadata } = useRemotePeer<TPeerMetadata>({
    peerId: remotePeerId,
  });

  return (
    <div className="text-lg">Opponent: {remotePeerMetadata?.displayName}</div>
  );
};
