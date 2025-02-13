import { CredentialsSignin } from '@auth/core/errors';
import { SignJWT, jwtVerify } from 'jose';
import { verifyMessage } from 'viem';
import { z } from 'zod';
import { env } from '../env';

// This should be a secure random key, stored in your environment variables
const JWT_SECRET = new TextEncoder().encode(env.AUTH_SECRET);

class CustomCredsError extends CredentialsSignin {
  code = 'CustomCredsError';
  constructor(message: string) {
    super();
    this.code = message;
  }
}

const CredsSchema = z.object({
  address: z.custom<`0x${string}`>(),
  signature: z.custom<`0x${string}`>(),
});

/**
 * Creates a challenge JWT and message that expires in 5 minutes
 */
async function createChallengeToken(
  walletAddress: string,
): Promise<{ token: string; message: string }> {
  const nonce = crypto.randomUUID();
  const message = constructChallengeMessage(walletAddress.toLowerCase(), nonce);

  // Create a JWT containing the challenge data
  const token = await new SignJWT({
    walletAddress: walletAddress.toLowerCase(),
    nonce,
    message,
    type: 'challenge',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(JWT_SECRET);

  return { token, message };
}

/**
 * Constructs the message to be signed by the wallet
 * Following EIP-191 format for structured data
 */
function constructChallengeMessage(
  walletAddress: string,
  nonce: string,
): string {
  return `Welcome to Triumvirate!

Please sign this message to verify your wallet ownership.
This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}`;
}

/**
 * Verifies the challenge token and signature
 */
async function verifyChallengeToken(
  token: string,
  signature: string,
  walletAddress: string,
): Promise<boolean> {
  try {
    // Verify and decode the JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check if this is a challenge token
    if (payload.type !== 'challenge') {
      throw new CustomCredsError('Invalid token type');
    }

    // Check if the wallet address matches
    if (payload.walletAddress !== walletAddress.toLowerCase()) {
      throw new CustomCredsError('Wallet address mismatch');
    }

    // Verify the signature using the message stored in the token
    const recoveredAddress = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message: payload.message as string,
      signature: signature as `0x${string}`,
    });

    return recoveredAddress;
  } catch (error) {
    if (error instanceof CustomCredsError) {
      throw error;
    }
    throw new CustomCredsError('Invalid or expired challenge');
  }
}

export {
  CredsSchema,
  constructChallengeMessage,
  createChallengeToken,
  verifyChallengeToken,
};
