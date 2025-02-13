import ActiveCards from './ActiveCards';
import CardDeck from './CardDeck';
import WinningCardStacks from './WinningCardStacks';

interface Props {
  gameCode: string;
}

const GameWrapper = ({ gameCode }: Props) => {
  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <WinningCardStacks gameCode={gameCode} />
      <ActiveCards />
      <CardDeck />
    </div>
  );
};

export default GameWrapper;
