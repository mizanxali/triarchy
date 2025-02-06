import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ?? '',
  max: 10,
});

export const dbPool = drizzle(pool, {
  schema,
});
