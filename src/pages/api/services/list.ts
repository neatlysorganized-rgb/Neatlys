import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, internalError } from '../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'GET')) return;

  try {
    const result = await query('SELECT id, name, description, base_price, duration_minutes, category, image_url FROM services ORDER BY created_at DESC LIMIT 100');
    res.json({ services: result.rows });
  } catch (err: unknown) {
    internalError(res, 'services/list', err);
  }
}
