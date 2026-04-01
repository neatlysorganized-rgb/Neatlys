import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, getAuthToken, internalError } from '../../../lib/api';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'GET')) return;

  const token = getAuthToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'unauthenticated' });

  try {
    const result = await query('SELECT * FROM bookings WHERE client_id = $1 ORDER BY created_at DESC', [payload.userId]);
    res.json({ bookings: result.rows });
  } catch (err: unknown) {
    internalError(res, 'bookings/list', err);
  }
}
