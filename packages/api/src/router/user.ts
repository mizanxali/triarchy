import type { TRPCRouterRecord } from '@trpc/server';
import { z } from 'zod';
import { formatEther } from 'viem';
import { createChallengeToken } from '@battleground/web3/jwt';
import { publicProcedure } from '../procedures';
import { publicClient } from '@battleground/web3/client';
import { GameWagerABI } from '@battleground/web3/abis';
import { GAME_WAGER_ADDRESS } from '@battleground/web3/constants';

export const userRouter = {
  generateChallenge: publicProcedure
    .input(z.object({ walletAddress: z.string().toLowerCase() }))
    .mutation(async ({ input }) => {
      return createChallengeToken(input.walletAddress);
    }),

  fetchLeaderboard: publicProcedure.query(async () => {
    const leaderboard = await publicClient.readContract({
      address: GAME_WAGER_ADDRESS,
      abi: GameWagerABI,
      functionName: 'getAllPlayerStats',
    });

    const playerStats = leaderboard.map((player) => ({
      walletAddress: player.playerAddress,
      wins: Number(formatEther(player.wins)),
      losses: Number(formatEther(player.losses)),
      totalWon: Number(formatEther(player.totalWon)),
      totalWagered: Number(formatEther(player.totalWagered)),
    }));

    const sortedLeaderboard = playerStats.sort((a, b) => b.wins - a.wins);

    return sortedLeaderboard;
  }),
} satisfies TRPCRouterRecord;
