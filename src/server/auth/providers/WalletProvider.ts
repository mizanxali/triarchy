import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyChallengeToken } from '~/lib/web3/utils/jwt';

export class CustomCredsError extends CredentialsSignin {
  code = 'CustomCredsError err';

  constructor(message: string) {
    super();
    this.code = message;
  }
}

const CredsSchema = z.object({
  address: z.custom<`0x${string}`>(),
  signature: z.custom<`0x${string}`>(),
});

const WalletProvider = Credentials({
  name: 'Ethereum Wallet Login',
  credentials: {
    address: { label: 'Wallet Address', type: 'text' },
    signature: { label: 'Signature', type: 'text' },
    token: { label: 'Challenge Token', type: 'text' },
  },
  authorize: async (credentials) => {
    const { address, signature, token } = await z
      .object({
        ...CredsSchema.shape,
        token: z.string(),
      })
      .parseAsync(credentials);

    const isValid = await verifyChallengeToken(token, signature, address);

    if (!isValid) {
      throw new CustomCredsError('Signature verification failed');
    }

    return {
      id: address,
      walletAddress: address,
    };
  },
});

export default WalletProvider;
