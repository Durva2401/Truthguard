import { promises as fs } from 'fs';
import path from 'path';
import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
} from 'crypto';

/* ═══════════════════════════════════════════
   TruthGuard — Email/Password auth (JSON store)
   Server-only. No external dependencies.
═══════════════════════════════════════════ */

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  /** scrypt hash in the form `salt:hash` (both hex) */
  passwordHash: string;
  createdAt: string;
}

/** Public shape returned to the client — never includes the hash. */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export const SESSION_COOKIE = 'tg_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function getSecret(): string {
  return process.env.AUTH_SECRET || 'tg-dev-insecure-secret-change-in-production';
}

/* ── JSON user store ─────────────────────── */

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf8');
  }
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureStore();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email === normalized);
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<StoredUser> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();

  const user: StoredUser = {
    id: randomBytes(12).toString('hex'),
    email: normalized,
    name: name.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

/* ── Password hashing (scrypt) ───────────── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = scryptSync(password, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

/* ── Signed session tokens (HMAC) ────────── */

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sign(payload: string): string {
  return base64url(createHmac('sha256', getSecret()).update(payload).digest());
}

/** Create a signed session token for a user id. */
export function createSessionToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = base64url(JSON.stringify({ sub: userId, exp }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a session token; returns the user id or null. */
export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  // Constant-time signature comparison
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    ) as { sub: string; exp: number };
    if (!decoded.sub || !decoded.exp) return null;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null; // expired
    return decoded.sub;
  } catch {
    return null;
  }
}

/* ── Cookie config helper ────────────────── */

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

/* ── Utilities ───────────────────────────── */

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
