import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, internalError } from '../../../lib/api';
import { parsePositiveInteger } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'GET')) return;

  const { id } = req.query;
  const serviceId = parsePositiveInteger(Array.isArray(id) ? id[0] : id);
  if (!serviceId) return res.status(400).json({ error: 'invalid id' });

  try {
    const result = await query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const service = result.rows[0];
    if (!service) return res.status(404).json({ error: 'not found' });
    res.json({ service });
  } catch (err: unknown) {
    internalError(res, 'services/details', err);
  }
}
