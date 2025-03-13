'use server';

import { formatEther } from 'viem';
import { GameWagerABI } from '~/lib/web3/abis';
import { publicClient } from '~/lib/web3/client';
import { GAME_WAGER_ADDRESS } from '~/lib/web3/constants';
import { createChallengeToken } from '~/lib/web3/utils/jwt';
import { type CustomCredsError, signIn, signOut } from '~/server/auth';

interface SignInProps {
  address: `0x${string}`;
  signature: `0x${string}`;
  token: string;
}

export const login = async ({ address, signature, token }: SignInProps) => {
  try {
    await signIn('credentials', {
      address,
      signature,
      token,
      redirect: false,
    });
  } catch (error) {
    const code = (error as CustomCredsError).code;
    if (code) {
      console.error({ error, code });
      return {
        message: code,
      };
    }

    console.error(error);
    throw new Error('An error occurred while logging in');
  }
};

export const generateLoginChallenge = async (address: `0x${string}`) => {
  try {
    const challenge = await createChallengeToken(address);
    return challenge;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate login challenge');
  }
};

export const logout = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error: unknown) {
    console.error(error);
    throw new Error('An error occurred while logging out');
  }
};
