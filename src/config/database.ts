import { Pool, QueryResult } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  pool = new Pool({ connectionString });
  return pool;
}

export async function query<RowType = unknown>(text: string, params: unknown[] = []): Promise<QueryResult<RowType>> {
  const res = await getPool().query<RowType>(text, params);
  return res;
}
