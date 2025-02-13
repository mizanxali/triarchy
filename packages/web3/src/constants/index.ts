export const HUDL_RPC_URLS = {
  id: 2524852,
  name: 'Huddle01 Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://huddle-testnet.rpc.caldera.xyz/http'],
      webSocket: ['wss://huddle-testnet.rpc.caldera.xyz/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Huddle01 Explorer',
      url: 'https://huddle-testnet.explorer.caldera.xyz/',
    },
  },
  testnet: true,
} as const;

export const GAME_WAGER_ADDRESS = '0xFb3dd9524F1fCFC25Bee724F51262293F767da92';

export const HUDDLE_EXPLORER_URL =
  'https://huddle-testnet.explorer.caldera.xyz';
