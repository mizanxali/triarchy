import { usePeerIds, useRoom } from '@huddle01/react';
import { Role } from '@huddle01/server-sdk/auth';
import Rules from '../common/Rules';

interface Props {
  gameCode: string;
}

const GameInfo = ({ gameCode }: Props) => {
  const [opponentPeerId] = usePeerIds({ roles: [Role.GUEST] }).peerIds;
  const { state } = useRoom();

  return (
    <div className="flex flex-col gap-2 text-center items-center text-white">
      <div>
        <div className="text-2xl font-semibold">
          Game Code: <span className="text-yellow-600">{gameCode}</span>
        </div>
        <div className="text-base">Room State: {state}</div>
      </div>
      <div>
        {opponentPeerId ? null : (
          <div className="text-lg font-medium">
            <span>Waiting for opponent...</span>
          </div>
        )}
      </div>
      <Rules />
    </div>
  );
};

export default GameInfo;
