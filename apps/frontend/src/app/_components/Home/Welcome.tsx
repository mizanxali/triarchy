import { Button } from '@battleground/ui/button';
import { Input } from '@battleground/ui/input';
import { GameWagerABI } from '@battleground/web3/abis';
import { publicClient } from '@battleground/web3/client';
import { GAME_WAGER_ADDRESS } from '@battleground/web3/constants';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import { env } from '~/env';
import SignOutButton from '../common/SignOutButton';
import Leaderboard from './Leaderboard';

interface Props {
  walletAddress: string;
  joinRoom: (data: { roomId: string; token: string }) => Promise<unknown>;
}

const Welcome = ({ walletAddress, joinRoom }: Props) => {
  const [enteredGameCode, setEnteredGameCode] = useState('');
  const [wagerAmount, setWagerAmount] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

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

  const onCreateGameHandler = async () => {
    try {
      if (wagerAmount === '' || wagerAmount === '0') {
        alert('Wager amount cannot be 0');
        return;
      }

      setIsCreatingGame(true);

      const resp = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wagerAmount,
        }),
      });

      const data = (await resp.json()) as { roomId: string };

      const roomId = data.roomId;

      // const txnHash = await writeContractAsync({
      //   abi: GameWagerABI,
      //   address: GAME_WAGER_ADDRESS,
      //   functionName: 'createGame',
      //   args: [roomId],
      //   value: parseEther(wagerAmount),
      // });

      // const receipt = await publicClient.waitForTransactionReceipt({
      //   hash: txnHash,
      //   retryCount: 3,
      //   retryDelay: 1000,
      // });

      // if (receipt.status !== 'success') {
      //   console.error({ receipt });
      //   throw new Error('Create Game Transaction failed');
      // }

      const tokenResp = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          walletAddress,
        }),
      });

      const tokenData = (await tokenResp.json()) as { token: string };

      await joinRoom({
        roomId,
        token: tokenData.token,
      });
      setIsCreatingGame(false);
      setIsJoiningGame(false);

      console.log(data);
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

      // const txnHash = await writeContractAsync({
      //   abi: GameWagerABI,
      //   address: GAME_WAGER_ADDRESS,
      //   functionName: 'joinGame',
      //   args: [enteredGameCode],
      //   value: gameInfo.data.wagerAmount,
      // });

      // const receipt = await publicClient.waitForTransactionReceipt({
      //   hash: txnHash,
      //   retryCount: 3,
      //   retryDelay: 1000,
      // });

      // if (receipt.status !== 'success') {
      //   console.error({ receipt });
      //   throw new Error('Join Game Transaction failed');
      // }

      const tokenResp = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: enteredGameCode,
          walletAddress,
        }),
      });

      const tokenData = (await tokenResp.json()) as { token: string };

      await joinRoom({
        roomId: enteredGameCode,
        token: tokenData.token,
      });
    } catch (error) {
      console.error(error);
      setIsJoiningGame(false);
    }
  };

  return (
    <div className="w-full text-center h-screen flex flex-col items-center gap-10 pt-32">
      <h1 className="text-[82px] uppercase text-yellow-600 font-sancreek">
        Triumvirate
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
                isCreatingGame || wagerAmount === '' || wagerAmount === '0'
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
};

export default Welcome;
