import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAuthCookie, enforceMethod } from '../../../lib/api';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'POST')) return;

  clearAuthCookie(res);
  res.status(200).json({ ok: true });
}
