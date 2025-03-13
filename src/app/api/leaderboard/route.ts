import { formatEther } from 'viem/utils';
import { GameWagerABI } from '~/lib/web3/abis';
import { publicClient } from '~/lib/web3/client';
import { GAME_WAGER_ADDRESS } from '~/lib/web3/constants';

export async function GET() {
  try {
    const leaderboard = await publicClient.readContract({
      address: GAME_WAGER_ADDRESS,
      abi: GameWagerABI,
      functionName: 'getAllPlayerStats',
    });

    const playerStats = leaderboard.map((player) => ({
      walletAddress: player.playerAddress,
      wins: Number(player.wins),
      losses: Number(player.losses),
      totalWon: Number(formatEther(player.totalWon)).toFixed(4),
      totalWagered: Number(formatEther(player.totalWagered)).toFixed(4),
    }));

    const sortedLeaderboard = playerStats.sort((a, b) => {
      // First sort by wins
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      // If wins are the same, sort by totalWon
      const bTotalWon = Number(b.totalWon);
      const aTotalWon = Number(a.totalWon);

      if (bTotalWon !== aTotalWon) {
        return bTotalWon - aTotalWon;
      }

      // If wins and totalWon are the same, sort by losses
      if (b.losses !== a.losses) {
        return a.losses - b.losses;
      }

      // If wins, totalWon, and losses are all the same, sort by totalWagered
      const bTotalWagered = Number(b.totalWagered);
      const aTotalWagered = Number(a.totalWagered);

      return bTotalWagered - aTotalWagered;
    });

    return Response.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return Response.json({ message: 'Failed to fetch leaderboard data' });
  }
}
