import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    AUTH_SECRET: z.string(),
    ADMIN_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
    NEXT_PUBLIC_ALCHEMY_URL: z.string(),
    NEXT_PUBLIC_PARTYKIT_HOST: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_ALCHEMY_URL: process.env.NEXT_PUBLIC_ALCHEMY_URL,
    ADMIN_API_KEY: process.env.ADMIN_API_KEY,
    NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
  },
});
