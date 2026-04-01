import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, internalError, setAuthCookie } from '../../../lib/api';
import { hashPassword, signToken } from '../../../lib/auth';
import { normalizeEmail, normalizeOptionalName, validatePassword } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'POST')) return;
  const { email, password, full_name } = req.body ?? {};
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return res.status(400).json({ error: 'invalid email' });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  const password_hash = await hashPassword(password);
  try {
    const insert = await query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [normalizedEmail, password_hash, normalizeOptionalName(full_name)]
    );
    const user = insert.rows[0];
    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);
    res.status(201).json({ token, user });
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === '23505') {
      return res.status(409).json({ error: 'email already exists' });
    }

    internalError(res, 'auth/register', err);
  }
}
