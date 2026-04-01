import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../config/database';
import { enforceMethod, getAuthToken, internalError } from '../../../lib/api';
import { verifyToken } from '../../../lib/auth';
import { parseDate, parseNonEmptyText, parsePositiveInteger, parsePositiveNumber, parseTime } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enforceMethod(req, res, 'POST')) return;

  const token = getAuthToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'unauthenticated' });

  const { service_id, service_provider_id, scheduled_date, scheduled_time, address, total_price } = req.body ?? {};
  const serviceId = parsePositiveInteger(service_id);
  const serviceProviderId = parsePositiveInteger(service_provider_id);
  const scheduledDate = parseDate(scheduled_date);
  const scheduledTime = parseTime(scheduled_time);
  const bookingAddress = parseNonEmptyText(address);
  const totalPrice = total_price == null ? null : parsePositiveNumber(total_price);

  if (!serviceId || !serviceProviderId || !scheduledDate || !scheduledTime || !bookingAddress) {
    return res.status(400).json({ error: 'invalid booking fields' });
  }

  if (total_price != null && totalPrice == null) {
    return res.status(400).json({ error: 'invalid total_price' });
  }

  try {
    const result = await query(
      'INSERT INTO bookings (client_id, service_id, service_provider_id, scheduled_date, scheduled_time, address, total_price, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [payload.userId, serviceId, serviceProviderId, scheduledDate, scheduledTime, bookingAddress, totalPrice, 'pending']
    );
    res.status(201).json({ booking: result.rows[0] });
  } catch (err: unknown) {
    internalError(res, 'bookings/create', err);
  }
}
