import type { Metadata, Viewport } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Cairo, Chakra_Petch, MedievalSharp, Sancreek } from 'next/font/google';

import { cn } from '@battleground/ui';

import { TRPCReactProvider } from '~/trpc/react';

import '~/app/globals.css';

import { Web3Provider } from './_layouts/Web3Provider';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: 'black' }],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://play-triumvirate.vercel.app'),
  title: 'Triumvirate',
  description:
    'Master the trinity of combat in this tactical card game where superior numbers meet strategic counters in a battle for supremacy.',
};

const medieval = MedievalSharp({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medieval-sharp',
});

const chakra = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch',
});

const sancreek = Sancreek({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sancreek',
});

const cairo = Cairo({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-cairo min-h-screen text-white antialiased relative',
          sancreek.variable,
          medieval.variable,
          cairo.variable,
        )}
        style={{
          position: 'relative',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/backgrounds/battleback8.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <Web3Provider>
          <SessionProvider>
            <TRPCReactProvider>
              <div className="relative z-10">{props.children}</div>
            </TRPCReactProvider>
          </SessionProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
