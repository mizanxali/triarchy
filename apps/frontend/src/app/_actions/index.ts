'use server';

import { type CustomCredsError, signIn, signOut } from '@battleground/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';

interface Props {
  address: `0x${string}`;
  signature: `0x${string}`;
}

export const login = async ({ address, signature }: Props) => {
  try {
    await signIn('credentials', {
      address,
      signature,
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

export const logout = async () => {
  try {
    // don't run this with redirection set to true
    await signOut({ redirect: false });
  } catch (error: unknown) {
    console.error(error);
    throw new Error('An error occurred while logging out');
  }
};
