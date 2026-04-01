import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, getAuthToken, internalError } from '../../../lib/api';
import { verifyToken } from '../../../lib/auth';
import { parseNonEmptyText, parsePositiveInteger, parseRating } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'POST')) return;

  const token = getAuthToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'unauthenticated' });

  const { booking_id, rating, comment } = req.body ?? {};
  const bookingId = parsePositiveInteger(booking_id);
  const numericRating = parseRating(rating);
  const parsedComment = comment == null ? null : parseNonEmptyText(comment);

  if (!bookingId || !numericRating) return res.status(400).json({ error: 'invalid fields' });
  if (comment != null && parsedComment == null) return res.status(400).json({ error: 'invalid comment' });

  try {
    const result = await query('INSERT INTO reviews (booking_id, rating, comment) VALUES ($1,$2,$3) RETURNING *', [bookingId, numericRating, parsedComment]);
    res.status(201).json({ review: result.rows[0] });
  } catch (err: unknown) {
    internalError(res, 'reviews/create', err);
  }
}
