'use client';

import { hudlChain } from '@battleground/web3/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { env } from '~/env';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [hudlChain],

    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(env.NEXT_PUBLIC_ALCHEMY_URL),
      [hudlChain.id]: http('https://huddle-testnet.rpc.caldera.xyz/http'),
    },

    // Required API Keys
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: 'Huddle01 Node Dashboard',

    // Optional App Info
    appDescription: 'Huddle01 Node Dashboard',
    appUrl: 'https://huddle01.network', // your app's url
    appIcon: 'https://huddle01.network/favicon.ico', // your app's icon, no bigger than 1024x1024px (max. 1MB)
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
