import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_COOKIE_NAME = 'neatlys_auth';
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function enforceMethod(req: NextApiRequest, res: NextApiResponse, method: string): boolean {
  if (req.method === method) {
    return true;
  }

  res.setHeader('Allow', method);
  res.status(405).json({ error: 'method not allowed' });
  return false;
}

export function getBearerToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

function getCookieValue(req: NextApiRequest, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookieEntry of cookies) {
    const [rawName, ...rest] = cookieEntry.trim().split('=');
    if (rawName !== name) {
      continue;
    }

    const rawValue = rest.join('=');
    if (!rawValue) {
      return null;
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

export function getAuthToken(req: NextApiRequest): string | null {
  return getBearerToken(req) || getCookieValue(req, AUTH_COOKIE_NAME);
}

export function setAuthCookie(res: NextApiResponse, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}${secure}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearAuthCookie(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookie = `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
  res.setHeader('Set-Cookie', cookie);
}

export function internalError(res: NextApiResponse, context: string, error: unknown): void {
  console.error(`[api:${context}]`, error);
  res.status(500).json({ error: 'internal server error' });
}
