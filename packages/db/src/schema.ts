import { sql, type SQL } from 'drizzle-orm';
import {
  type AnyPgColumn,
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

export const User = pgTable('user', {
  id: uuid('id').notNull().defaultRandom(),
  walletAddress: varchar('walletAddress', { length: 255 })
    .notNull()
    .primaryKey(),
  level: integer('level').notNull().default(0),
  gamesWon: integer('gamesWon').notNull().default(0),
  gamesLost: integer('gamesLost').notNull().default(0),
  amountWagered: integer('amountWagered').notNull().default(0),
  amountWon: integer('amountWon').notNull().default(0),
});

export const ChallengeStore = pgTable('challengeStore', {
  id: uuid('id').notNull().defaultRandom(),
  walletAddress: varchar('walletAddress', { length: 255 })
    .notNull()
    .primaryKey(),
  issuedAt: timestamp('issuedAt').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  nonce: varchar('nonce', { length: 255 }).notNull(),
});

// custom lower function
export function lower(val: AnyPgColumn): SQL {
  return sql`lower(${val})`;
}
