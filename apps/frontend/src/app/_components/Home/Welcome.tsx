import { Button } from '@battleground/ui/button';
import { Input } from '@battleground/ui/input';
import { GameWagerABI } from '@battleground/web3/abis';
import { publicClient } from '@battleground/web3/client';
import { GAME_WAGER_ADDRESS } from '@battleground/web3/constants';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import { api } from '~/trpc/react';
import SignOutButton from '../common/SignOutButton';
import PlayerStats from './PlayerStats';

interface Props {
  walletAddress: string;
  joinRoom: (data: { roomId: string; token: string }) => Promise<unknown>;
}

const Welcome = ({ walletAddress, joinRoom }: Props) => {
  const [createdGameCode, setCreatedGameCode] = useState('');
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

  const { mutateAsync: gameCreated } = api.room.gameCreated.useMutation({
    onSuccess: async ({ roomId }) => {
      await createAccessToken({ roomId });
    },
    onError: (error) => {
      console.error(error);
      setIsCreatingGame(false);
    },
  });

  const { mutateAsync: createRoom } = api.room.createRoom.useMutation({
    onSuccess: async ({ roomId }) => {
      setCreatedGameCode(roomId);

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

      console.log(receipt);

      if (receipt.status !== 'success') {
        console.error({ receipt });
        throw new Error('Create Game Transaction failed');
      }

      await gameCreated({ roomId, wagerAmount });
    },
    onError: (error) => {
      console.error(error);
      setIsCreatingGame(false);
    },
  });

  const { mutateAsync: createAccessToken } =
    api.room.createAccessToken.useMutation({
      onSuccess: async (token) => {
        const roomId =
          createdGameCode.length > 0 ? createdGameCode : enteredGameCode;
        if (roomId.length === 0) return;
        await joinRoom({
          roomId,
          token,
        });
        setIsCreatingGame(false);
        setIsJoiningGame(false);
      },
      onError: (error) => {
        console.error(error);
        setIsCreatingGame(false);
        setIsJoiningGame(false);
      },
    });

  const onCreateGameHandler = async () => {
    try {
      if (wagerAmount === '' || wagerAmount === '0') {
        alert('Wager amount cannot be 0');
        return;
      }

      setIsCreatingGame(true);

      await createRoom({ wagerAmount });
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

      await createAccessToken({ roomId: enteredGameCode });
    } catch (error) {
      console.error(error);
      setIsJoiningGame(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="text-9xl uppercase mt-20 text-yellow-600">Triumvirate</h1>
      <div className="flex-1 flex flex-col gap-12 pt-16 items-center w-1/2">
        <h3 className="text-zinc-200 text-4xl font-medium text-center">
          Welcome {walletAddress}
        </h3>
        <PlayerStats walletAddress={walletAddress} />
        <div className="w-full grid grid-cols-2">
          <div className="flex-1 flex flex-col items-center gap-4 p-4 w-full">
            <Input
              className="w-3/4"
              value={wagerAmount}
              onChange={(e) => setWagerAmount(e.target.value)}
              placeholder="Enter Wager Amount (ETH)"
              type="number"
            />
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
        <SignOutButton />
      </div>
    </div>
  );
};

export default Welcome;
