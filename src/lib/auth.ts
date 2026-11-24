import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'bixus_admin_session';
export const PREVIEW_COOKIE_NAME = 'bixus_preview_auth';

function getSecret(): string {
  return process.env.AUTH_SECRET || 'bixus-local-dev-secret-2026';
}

export function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return payload;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  return Boolean(payload && payload.startsWith('admin:'));
}
