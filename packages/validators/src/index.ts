import { z } from 'zod';

const cardSchema = z.enum([
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'H7',
  'H8',
]);

export type TCard = z.infer<typeof cardSchema>;
