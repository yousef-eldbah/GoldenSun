import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'golden_sun_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[auth] ADMIN_PASSWORD environment variable is not set.');
    }
    return 'GoldenSunAdmin2025!';
  }
  return pwd;
}

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[auth] ADMIN_SECRET environment variable is not set.');
    }
    return 'golden-sun-admin-secure-salt-2025-fallback';
  }
  return secret;
}

export { SESSION_COOKIE_NAME };

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  const adminPwd = getAdminPassword();
  // Constant-time comparison to prevent timing attacks
  const inputBuffer = Buffer.from(password);
  const targetBuffer = Buffer.from(adminPwd);

  if (inputBuffer.length !== targetBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `admin:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', getAdminSecret())
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const [role, expiresAtStr] = payload.split(':');

  if (role !== 'admin') return false;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', getAdminSecret())
    .update(payload)
    .digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}
