import NextAuth from 'next-auth';

import type { User } from 'next-auth';

import { authConfig } from './config';

import { CustomCredsError } from './providers/WalletProvider';

export type { Session } from 'next-auth';

export type TUser = {
  id: string;
  walletAddress: string;
  isNewUser: boolean;
} & User;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut, CustomCredsError };
