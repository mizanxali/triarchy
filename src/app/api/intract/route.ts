import { NextResponse } from 'next/server';
import { GameWagerABI } from '~/lib/web3/abis';
import { publicClient } from '~/lib/web3/client';
import { GAME_WAGER_ADDRESS } from '~/lib/web3/constants';

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as { address: `0x${string}` };

    let result = false;

    const [totalWins, totalLosses] = await publicClient.readContract({
      abi: GameWagerABI,
      address: GAME_WAGER_ADDRESS,
      functionName: 'getPlayerStats',
      args: [address],
    });

    if (totalWins > 0 || totalLosses > 0) result = true;

    return NextResponse.json({
      data: {
        result,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: {
        code: 0,
        message: 'Internal server error',
      },
      data: {
        result: false,
      },
    });
  }
}
