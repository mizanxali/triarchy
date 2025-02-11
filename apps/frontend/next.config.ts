import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';
import type { NextConfig } from 'next';

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))('./src/env');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* config options here */
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@battleground/api',
    '@battleground/auth',
    '@battleground/db',
    '@battleground/ui',
    '@battleground/validators',
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },

  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
