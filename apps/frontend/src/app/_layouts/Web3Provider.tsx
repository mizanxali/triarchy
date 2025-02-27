'use client';

import { hudlChain } from '@battleground/web3/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, type Config } from 'wagmi';
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet } from 'wagmi/chains';

import { env } from '~/env';

const queryClient = new QueryClient();

const metadata = {
  name: 'Triarchy',
  description:
    'Master the trinity of combat in this tactical card game where superior numbers meet strategic counters in a battle for supremacy.',
  url: 'https://play-triarchy.vercel.app/',
  icons: ['https://play-triarchy.vercel.app/favicon.ico'],
};

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  // @ts-ignore
  networks: [hudlChain],
  transports: {
    [mainnet.id]: http(env.NEXT_PUBLIC_ALCHEMY_URL),
    [hudlChain.id]: http('https://huddle-testnet.rpc.caldera.xyz/http'),
  },
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  // @ts-ignore
  networks: [hudlChain],
  // @ts-ignore
  defaultNetwork: hudlChain,
  metadata: metadata,
  excludeWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
  ],
  enableWalletConnect: false,
  features: {
    socials: false,
    email: false,
    onramp: false,
  },
});

interface Props {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Props) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
