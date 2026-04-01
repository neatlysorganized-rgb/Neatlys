import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

export const pool = new Pool({ connectionString });

export async function query<RowType = unknown>(text: string, params: unknown[] = []): Promise<QueryResult<RowType>> {
  const res = await pool.query<RowType>(text, params);
  return res;
}
