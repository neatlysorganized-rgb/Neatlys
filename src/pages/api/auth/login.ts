import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, internalError, setAuthCookie } from '../../../lib/api';
import { verifyPassword, signToken } from '../../../lib/auth';
import { normalizeEmail } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'POST')) return;
  const { email, password } = req.body ?? {};
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return res.status(400).json({ error: 'invalid email' });
  if (typeof password !== 'string' || password.length === 0) return res.status(400).json({ error: 'invalid credentials' });

  try {
    const result = await query('SELECT id, email, password_hash, full_name FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err: unknown) {
    internalError(res, 'auth/login', err);
  }
}
