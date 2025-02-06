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

export const LICENSE_ADDRESS = '0xbc9AC52e158670FAd17419cd6D6CB6880d8b7442';

export const POOL_MANAGER_ADDRESS =
  '0xF427614823Ef467f6f7F54BBa41dB03C119a3E43';

export const PROOF_OF_RESOURCE = '0x362D3D1A752aa14b1f64A6E13098503976F15A43';

export const BOOTSTRAPPING_REWARD =
  '0x9dEA421FD1d7970833C08a22Ac5487f356DE2647';

export const MULTICALL3_ADDRESS = '0x81D0b3d211c62617E3FeC8A0638A8c07617E353a';

export const HUDDLE_EXPLORER_URL =
  'https://huddle-testnet.explorer.caldera.xyz';

export const TOKEN_ADDRESS = '0xe4447C2268A5523E6FC71B5876eddD18Ed5898E8';
