import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const neonSql = neon(process.env.POSTGRES_URL ?? '');

export const db = drizzle(neonSql, { schema });
