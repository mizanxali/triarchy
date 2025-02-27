import ActiveCards from './ActiveCards';
import CardDeck from './CardDeck';
import WinningCardStacks from './WinningCardStacks';

interface Props {
  walletAddress: string;
}

const GameWrapper = ({ walletAddress }: Props) => {
  return (
    <div className="w-full h-screen flex flex-col p-6 justify-between">
      <WinningCardStacks />
      <ActiveCards walletAddress={walletAddress} />
      <CardDeck />
    </div>
  );
};

export default GameWrapper;
