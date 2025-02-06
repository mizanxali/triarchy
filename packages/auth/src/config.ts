import type { DefaultSession, NextAuthConfig } from 'next-auth';

import { env } from '../env';
import WalletProvider from './providers/WalletProvider';
import type { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
      isNewUser: boolean;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  secret: env.AUTH_SECRET,
  providers: [WalletProvider],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as AdapterUser & {
        id: string;
        walletAddress: string;
        isNewUser: boolean;
      };
      return session;
    },
  },
} satisfies NextAuthConfig;
