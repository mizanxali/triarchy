import { formatEther } from 'viem/utils';
import { GameReferralsABI, GameWagerABI } from '~/lib/web3/abis';
import { publicClient } from '~/lib/web3/client';
import {
  GAME_REFERRALS_ADDRESS,
  GAME_WAGER_ADDRESS,
} from '~/lib/web3/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const leaderboard = await publicClient.readContract({
      address: GAME_WAGER_ADDRESS,
      abi: GameWagerABI,
      functionName: 'getAllPlayerStats',
    });

    const result = await publicClient.readContract({
      address: GAME_REFERRALS_ADDRESS,
      abi: GameReferralsABI,
      functionName: 'getAllReferralData',
    });
    const [users, counts, earnings] = result as [string[], bigint[], bigint[]];

    const playerStats = [];

    for (const player of leaderboard) {
      const playerStat = {
        walletAddress: player.playerAddress,
        wins: Number(player.wins),
        losses: Number(player.losses),
        totalWon: Number(formatEther(player.totalWon)).toFixed(4),
        totalWagered: Number(formatEther(player.totalWagered)).toFixed(4),
        referrals: 0,
        points: Number(player.wins),
      };
      const referralIndex = users.findIndex(
        (user) => user === player.playerAddress,
      );
      if (referralIndex !== -1) {
        playerStat.referrals = Number(counts[referralIndex]);
        playerStat.points =
          Number(playerStat.wins) + Number(playerStat.referrals);
      }
      playerStats.push(playerStat);
    }

    const sortedLeaderboard = playerStats.sort((a, b) => {
      // First sort by points
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // If points are the same, sort by wins
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

    //if walletaddress sent as query param, return the leaderboard for that wallet address
    const walletAddress = searchParams.get('walletAddress');
    if (walletAddress) {
      const walletIndex = sortedLeaderboard.findIndex(
        (player) => player.walletAddress === walletAddress,
      );
      if (walletIndex !== -1) {
        const walletStats = sortedLeaderboard[walletIndex];
        if (walletStats) {
          const response = [
            {
              walletAddress: walletStats.walletAddress,
              rank: walletIndex + 1,
              score: walletStats.wins,
            },
          ];

          return Response.json(response);
        }
      }
      return Response.json({ message: 'Wallet not found' });
    }

    return Response.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return Response.json({ message: 'Failed to fetch leaderboard data' });
  }
}
