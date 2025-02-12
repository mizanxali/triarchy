'use server';

import { type CustomCredsError, signIn, signOut } from '@battleground/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { api } from '~/trpc/server';

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
    if (isRedirectError(error)) {
      console.error(error);
      throw error;
    }

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
    const { token, message } = await api.user.generateChallenge({
      walletAddress: address,
    });

    return { token, message };
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
