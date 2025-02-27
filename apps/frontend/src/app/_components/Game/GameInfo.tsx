import Rules from '../common/Rules';
import CopyButton from '../Button/CopyButton';
import { useGameAtom } from '~/app/_atoms/game.atom';

const GameInfo = () => {
  const [{ gameCode }] = useGameAtom();

  return (
    <div className="flex flex-col gap-4 text-center items-center text-white mt-6">
      <div className="flex flex-row gap-2.5 items-center">
        <div className="text-3xl font-semibold">
          Game Code: <span className="text-yellow-600">{gameCode}</span>
        </div>
        <CopyButton text={gameCode ?? ''} />
      </div>
      <div>
        {/* {opponentPeerId ? null : (
          <div className="text-xl font-medium">
            <span>Waiting for opponent...</span>
          </div>
        )} */}
      </div>
      <Rules />
    </div>
  );
};

export default GameInfo;
