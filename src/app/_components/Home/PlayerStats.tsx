import { GameWagerABI } from '~/lib/web3/abis';
import { GAME_WAGER_ADDRESS } from '~/lib/web3/constants';
import React from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

const PlayerStats = ({ walletAddress }: { walletAddress: string }) => {
  const { data: playerStats } = useReadContract({
    abi: GameWagerABI,
    address: GAME_WAGER_ADDRESS,
    functionName: 'getPlayerStats',
    args: [walletAddress as `0x${string}`],
    query: {
      enabled: true,
    },
  });

  if (!playerStats) return null;

  const [totalWins, totalLosses, ethWon, ethWagered] = playerStats;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">Total Wins</div>
        <div className="text-4xl text-yellow-600 font-extrabold">
          {totalWins.toString()}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">Total Losses</div>
        <div className="text-4xl text-yellow-600 font-extrabold">
          {totalLosses.toString()}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">Total ETH Wagered</div>
        <div className="text-4xl text-yellow-600 font-extrabold">
          {Number(formatEther(ethWagered)).toFixed(4)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">Total ETH Won</div>
        <div className="text-4xl text-yellow-600 font-extrabold">
          {Number(formatEther(ethWon)).toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
