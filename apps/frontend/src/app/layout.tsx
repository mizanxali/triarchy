import type { Metadata, Viewport } from 'next';
import { Chakra_Petch, Inter, Space_Grotesk } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import { cn } from '@battleground/ui';
import { ThemeProvider } from '@battleground/ui/theme';
import { Toaster } from '@battleground/ui/toaster';

import { TRPCReactProvider } from '~/trpc/react';

import '~/app/globals.css';

import { Web3Provider } from './_layouts/Web3Provider';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: 'black' }],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.huddle01.network'),
  title: 'Huddle01 | Network Dashboard',
  description:
    'Effortlessly Manage Node Keys & Earn Rewards Using Your Idle Bandwidth.',
  twitter: {
    card: 'summary_large_image',
    site: '@huddle01com',
    creator: '@huddle01com',
  },
};

const grotesk = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const chakra = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-chakra min-h-screen bg-background text-foreground antialiased',
          chakra.variable,
          grotesk.variable,
          inter.variable,
        )}
      >
        <Web3Provider>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <TRPCReactProvider>{props.children}</TRPCReactProvider>
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
