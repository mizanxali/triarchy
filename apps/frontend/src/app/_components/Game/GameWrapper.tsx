import ActiveCards from './ActiveCards';
import CardDeck from './CardDeck';
import WinningCardStacks from './WinningCardStacks';

const GameWrapper = () => {
  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <WinningCardStacks />
      <ActiveCards />
      <CardDeck />
    </div>
  );
};

export default GameWrapper;
