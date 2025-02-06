import {
  createPublicClient,
  http,
  defineChain,
  createWalletClient,
} from 'viem';
import type { Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import 'viem/chains';
import { HUDL_RPC_URLS } from '../constants';
import { arbitrum } from 'viem/chains';

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

export const arbWalletClient = createWalletClient({
  chain: arbitrum,
  transport: http(),
});
export const arbPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

// Get the Account which can be used to sign transactions
export const getAccountFromPrivateKey = (privateKey: `0x${string}`) => {
  const account = privateKeyToAccount(privateKey);

  return account;
};
