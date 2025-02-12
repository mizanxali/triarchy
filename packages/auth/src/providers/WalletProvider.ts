import { CredentialsSignin } from '@auth/core/errors';
import Credentials from '@auth/core/providers/credentials';
import { z } from 'zod';
import { verifyChallengeToken } from '@battleground/web3/jwt';

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

    const walletAddress = address.toLowerCase();

    const isValid = await verifyChallengeToken(token, signature, walletAddress);

    if (!isValid) {
      throw new CustomCredsError('Signature verification failed');
    }

    return {
      id: walletAddress,
      walletAddress,
    };
  },
});

export default WalletProvider;
