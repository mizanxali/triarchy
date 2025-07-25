import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type { TCard } from '~/lib/validators';
import { useGameAtom, useGameResetAtom } from '~/app/_atoms/game.atom';
import SignOutButton from '../common/SignOutButton';
import GameWrapper from './GameWrapper';
import Leaderboard from '../Home/Leaderboard';
import { GAME_WAGER_ADDRESS } from '~/lib/web3/constants';
import { useState } from 'react';
import PartySocket from 'partysocket';
import { GameWagerABI } from '~/lib/web3/abis';
import { useBalance, useReadContract, useWriteContract } from 'wagmi';
import { env } from '~/env';
import { generateGameCode } from '~/app/utils';
import { publicClient } from '~/lib/web3/client';
import { formatEther, parseEther } from 'viem';
import { Wallet } from 'lucide-react';
import { useMiscSetAtom } from '~/app/_atoms/misc.atom';
import { useSearchParams } from 'next/navigation';

interface Props {
  walletAddress: string;
}

const Root = ({ walletAddress }: Props) => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('referralCode');

  const [{ partySocket }, setGameAtom] = useGameAtom();
  const resetGameAtom = useGameResetAtom();
  const setMiscAtom = useMiscSetAtom();

  const [enteredGameCode, setEnteredGameCode] = useState('');
  const [wagerAmount, setWagerAmount] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const { data: balance } = useBalance({
    address: walletAddress as `0x${string}`,
  });
  const { writeContractAsync } = useWriteContract();
  const { refetch: fetchGameInfo } = useReadContract({
    abi: GameWagerABI,
    address: GAME_WAGER_ADDRESS,
    functionName: 'getGame',
    args: [enteredGameCode],
    query: {
      enabled: false,
    },
  });

  const onInitialCardsReceived = (data: {
    cards: { card: TCard; id: string }[];
    opponentWalletAddress: string;
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: data.cards,
      opponentWalletAddress: data.opponentWalletAddress,
      isPlayable: true,
    }));
  };

  const onOpponentCardPlayed = (card: { card: TCard; id: string }) => {
    setGameAtom((prev) => ({
      ...prev,
      opponentActiveCard: card,
    }));
  };

  const onTurnWin = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: true,
    }));
  };

  const onTurnLose = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: true,
    }));
  };

  const onTurnDraw = ({
    cards,
    wonCards,
    opponentWonCards,
  }: {
    cards: { card: TCard; id: string }[];
    wonCards: { card: TCard; id: string }[];
    opponentWonCards: { card: TCard; id: string }[];
  }) => {
    setGameAtom((prev) => ({
      ...prev,
      cardsDeck: [...cards],
      wonCards: [...wonCards],
      opponentWonCards: [...opponentWonCards],
      activeCard: undefined,
      opponentActiveCard: undefined,
      isPlayable: true,
    }));
  };

  const onGameOver = (
    data: { message: string; txnHash?: string },
    isWinner: boolean,
  ) => {
    resetGameAtom();

    setMiscAtom((prev) => ({
      ...prev,
      showGameOver: true,
      txnHash: data.txnHash,
      gameOverMessage: data.message,
      isWinner,
    }));
  };

  const onCreateGameHandler = async () => {
    try {
      if (wagerAmount === '' || wagerAmount === '0') {
        alert('Wager amount cannot be 0');
        return;
      }

      setIsCreatingGame(true);

      const roomId = generateGameCode();

      let isFirstGame = true;

      const [wins, losses] = await publicClient.readContract({
        address: GAME_WAGER_ADDRESS,
        abi: GameWagerABI,
        functionName: 'getPlayerStats',
        args: [walletAddress as `0x${string}`],
      });

      if (Number(wins) === 0 && Number(losses) === 0) {
        isFirstGame = true;
      }

      const txnHash = await writeContractAsync({
        abi: GameWagerABI,
        address: GAME_WAGER_ADDRESS,
        functionName: 'createGame',
        args: [roomId],
        value: parseEther(wagerAmount),
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txnHash,
        retryCount: 3,
        retryDelay: 1000,
      });

      if (receipt.status !== 'success') {
        console.error({ receipt });
        throw new Error('Create Game Transaction failed');
      }

      const partySocket = new PartySocket({
        host: env.NEXT_PUBLIC_PARTYKIT_HOST,
        room: roomId,
        query: {
          wagerAmount,
          walletAddress,
          referralCode: isFirstGame ? referralCode : undefined,
        },
      });

      partySocket.addEventListener('message', (e) => {
        const parsedPayload = JSON.parse(e.data);
        const label = parsedPayload.type;

        if (label === 'initial-cards') {
          onInitialCardsReceived(parsedPayload.data);
        } else if (label === 'turn-win') {
          console.log('You won the turn!', parsedPayload.data);
          onTurnWin(parsedPayload.data);
        } else if (label === 'turn-lose') {
          console.log('You lost the turn!', parsedPayload.data);
          onTurnLose(parsedPayload.data);
        } else if (label === 'turn-draw') {
          console.log('It was a draw!', parsedPayload.data);
          onTurnDraw(parsedPayload.data);
        } else if (label === 'opponent-card-played') {
          console.log('Opponent card played!', parsedPayload.data);
          onOpponentCardPlayed(parsedPayload.data);
        } else if (label === 'game-win') {
          console.log('You won the game!', parsedPayload.data);
          onGameOver(parsedPayload.data, true);
        } else if (label === 'game-lose') {
          console.log('You lost the game!', parsedPayload.data);
          onGameOver(parsedPayload.data, false);
        } else if (label === 'game-canceled') {
          console.log('Game canceled!', parsedPayload.data);
          onGameOver(parsedPayload.data, false);
        }
      });

      setIsCreatingGame(false);

      setGameAtom((prev) => ({
        ...prev,
        partySocket,
        gameCode: roomId,
      }));
    } catch (error) {
      console.error(error);
      setIsCreatingGame(false);
    }
  };

  const onJoinGameHandler = async () => {
    try {
      if (enteredGameCode === '') {
        alert('Game code cannot be empty');
        return;
      }

      setIsJoiningGame(true);

      const gameInfo = await fetchGameInfo();

      if (!gameInfo.data) {
        alert('Game not found');
        return;
      }

      const txnHash = await writeContractAsync({
        abi: GameWagerABI,
        address: GAME_WAGER_ADDRESS,
        functionName: 'joinGame',
        args: [enteredGameCode],
        value: gameInfo.data.wagerAmount,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txnHash,
        retryCount: 3,
        retryDelay: 1000,
      });

      if (receipt.status !== 'success') {
        console.error({ receipt });
        throw new Error('Join Game Transaction failed');
      }

      const partySocket = new PartySocket({
        host: env.NEXT_PUBLIC_PARTYKIT_HOST,
        room: enteredGameCode,
        query: {
          walletAddress,
        },
      });

      partySocket.addEventListener('message', (e) => {
        const parsedPayload = JSON.parse(e.data);
        const label = parsedPayload.type;

        if (label === 'initial-cards') {
          onInitialCardsReceived(parsedPayload.data);
        } else if (label === 'turn-win') {
          console.log('You won the turn!', parsedPayload.data);
          onTurnWin(parsedPayload.data);
        } else if (label === 'turn-lose') {
          console.log('You lost the turn!', parsedPayload.data);
          onTurnLose(parsedPayload.data);
        } else if (label === 'turn-draw') {
          console.log('It was a draw!', parsedPayload.data);
          onTurnDraw(parsedPayload.data);
        } else if (label === 'opponent-card-played') {
          console.log('Opponent card played!', parsedPayload.data);
          onOpponentCardPlayed(parsedPayload.data);
        } else if (label === 'game-win') {
          console.log('You won the game!');
          onGameOver(parsedPayload.data, true);
        } else if (label === 'game-lose') {
          console.log('You lost the game!');
          onGameOver(parsedPayload.data, false);
        } else if (label === 'game-canceled') {
          console.log('Game canceled!', parsedPayload.data);
          onGameOver(parsedPayload.data, false);
        }
      });

      setIsJoiningGame(false);

      setGameAtom((prev) => ({
        ...prev,
        partySocket,
        gameCode: enteredGameCode,
      }));
    } catch (error) {
      console.error(error);
      setIsJoiningGame(false);
    }
  };

  if (!partySocket)
    return (
      <div className="w-full text-center h-screen flex flex-col items-center gap-10 pt-32">
        <h1 className="text-[82px] uppercase text-yellow-600 font-sancreek">
          Triarchy
        </h1>
        <div className="flex-1 flex flex-col gap-8 items-center w-3/4">
          <div className="w-full grid grid-cols-2 pt-4">
            <div className="flex-1 flex flex-col items-center gap-4 p-4 w-full">
              <Input
                className="w-3/4"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                placeholder="Enter Wager Amount (ETH)"
                type="number"
              />
              {balance ? (
                <div className="text-zinc-200 font-bold text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <div>
                    Balance: {Number(formatEther(balance.value)).toFixed(4)} ETH
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-2 my-2">
                <Button
                  variant={'secondary'}
                  size="sm"
                  type="button"
                  onClick={() => setWagerAmount('0.0001')}
                  className="text-zinc-200 text-xs"
                >
                  0.0001 ETH
                </Button>
                <Button
                  variant={'secondary'}
                  size="sm"
                  type="button"
                  onClick={() => setWagerAmount('0.001')}
                  className="text-zinc-200 text-xs"
                >
                  0.001 ETH
                </Button>
                <Button
                  variant={'secondary'}
                  size="sm"
                  type="button"
                  onClick={() => setWagerAmount('0.01')}
                  className="text-zinc-200 text-xs"
                >
                  0.01 ETH
                </Button>
                <Button
                  variant={'secondary'}
                  size="sm"
                  type="button"
                  onClick={() => setWagerAmount('0.1')}
                  className="text-zinc-200 text-xs"
                >
                  0.1 ETH
                </Button>
                <Button
                  variant={'secondary'}
                  size="sm"
                  type="button"
                  onClick={() => setWagerAmount('1')}
                >
                  1 ETH
                </Button>
              </div>
              <Button
                disabled={
                  isCreatingGame ||
                  wagerAmount === '' ||
                  wagerAmount === '0' ||
                  !balance ||
                  Number(wagerAmount) > Number(formatEther(balance.value))
                }
                onClick={onCreateGameHandler}
                variant={'primary'}
              >
                {isCreatingGame ? 'Creating Game...' : 'Create Game'}
              </Button>
            </div>
            <div className="flex-1 border-l-2 border-gray-600 flex flex-col items-center gap-4 p-4 w-full">
              <Input
                className="w-3/4"
                value={enteredGameCode}
                onChange={(e) => setEnteredGameCode(e.target.value)}
                placeholder="Enter Game Code"
              />
              <Button
                disabled={!enteredGameCode || isJoiningGame}
                onClick={onJoinGameHandler}
                variant={'primary'}
              >
                {isJoiningGame ? 'Joining Game...' : 'Join Game'}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Leaderboard />
            <SignOutButton />
          </div>
        </div>
      </div>
    );

  return <GameWrapper walletAddress={walletAddress} />;
};

export default Root;
