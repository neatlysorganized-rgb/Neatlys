import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type AuthTokenPayload = {
  userId: number | string;
  email: string;
};

const jwtSecretFromEnv = process.env.JWT_SECRET;

if (!jwtSecretFromEnv && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

const JWT_SECRET = jwtSecretFromEnv || 'dev-only-secret-change-me';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthTokenPayload, expiresIn: jwt.SignOptions['expiresIn'] = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn, algorithm: 'HS256' });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as AuthTokenPayload;
    if (!payload || typeof payload !== 'object' || payload.userId == null || typeof payload.email !== 'string' || payload.email.length === 0) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
