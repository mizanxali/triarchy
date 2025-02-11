import type { Metadata, Viewport } from 'next';
import { MedievalSharp, Sancreek } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import { cn } from '@battleground/ui';
import { Toaster } from '@battleground/ui/toaster';

import { TRPCReactProvider } from '~/trpc/react';

import '~/app/globals.css';

import { Web3Provider } from './_layouts/Web3Provider';
import { MyHuddleProvider } from './_layouts/HuddleProvider';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: 'black' }],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.huddle01.network'),
  title: 'Card Battle',
  description: 'Card Battle',
  // twitter: {
  //   card: 'summary_large_image',
  //   site: '@huddle01com',
  //   creator: '@huddle01com',
  // },
};

const medieval = MedievalSharp({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medieval-sharp',
});

const sancreek = Sancreek({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sancreek',
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sancreek min-h-screen text-white antialiased',
          sancreek.variable,
          medieval.variable,
        )}
        style={{
          backgroundImage: 'url(/backgrounds/battleback5.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Web3Provider>
          <SessionProvider>
            <MyHuddleProvider>
              <TRPCReactProvider>{props.children}</TRPCReactProvider>
              <Toaster />
            </MyHuddleProvider>
          </SessionProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
