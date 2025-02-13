import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import 'viem/chains';
import { HUDL_RPC_URLS } from '../constants';

export const hudlChain = defineChain(HUDL_RPC_URLS);

export const publicClient = createPublicClient({
  chain: hudlChain,
  transport: http(),
  name: 'Huddle01 Testnet',
});

export const walletClient = createWalletClient({
  chain: hudlChain,
  transport: http(),
});
