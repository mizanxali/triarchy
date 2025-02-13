import { GameWagerABI } from '@battleground/web3/abis';
import { GAME_WAGER_ADDRESS } from '@battleground/web3/constants';
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
        <div className="text-xl">Total Wins</div>
        <div className="text-4xl text-yellow-600">{totalWins.toString()}</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl">Total Losses</div>
        <div className="text-4xl text-yellow-600">{totalLosses.toString()}</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl">Total ETH Wagered</div>
        <div className="text-4xl text-yellow-600">
          {Number(formatEther(ethWagered)).toFixed(4)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl">Total ETH Won</div>
        <div className="text-4xl text-yellow-600">
          {Number(formatEther(ethWon)).toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
