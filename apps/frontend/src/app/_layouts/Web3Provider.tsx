'use client';

import { hudlChain } from '@battleground/web3/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { env } from '~/env';

const config = createConfig(
  getDefaultConfig({
    chains: [hudlChain],
    transports: {
      [mainnet.id]: http(env.NEXT_PUBLIC_ALCHEMY_URL),
      [hudlChain.id]: http('https://huddle-testnet.rpc.caldera.xyz/http'),
    },
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: 'Card Battle',
    appDescription: 'Card Battle',
    appUrl: 'https://card-battle-mu.vercel.app/',
    appIcon: 'https://card-battle-mu.vercel.app/favicon.ico',
  }),
);

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Props) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
