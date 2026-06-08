import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const SESSION_COOKIE = '__session';
const FIVE_DAYS_S = 60 * 60 * 24 * 5;

function signSession(uid: string, exp: number): string {
  const payload = `${uid}:${exp}`;
  const secret = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.slice(0, 64) ?? 'fallback-secret';
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

export function verifySession(cookie: string): { uid: string } | null {
  try {
    const parts = cookie.split(':');
    if (parts.length !== 3) return null;
    const [uid, expStr, sig] = parts;
    const exp = parseInt(expStr, 10);
    if (Date.now() / 1000 > exp) return null;
    const expected = signSession(uid, exp);
    if (expected !== cookie) return null;
    return { uid };
  } catch {
    return null;
  }
}

// POST /api/auth/session — verify Firebase ID token and issue fast session cookie
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ ok: false }, { status: 400 });

    // verifyIdToken = local JWT check (fast) vs createSessionCookie = remote API call (slow)
    const decoded = await adminAuth().verifyIdToken(idToken);
    const exp = Math.floor(Date.now() / 1000) + FIVE_DAYS_S;
    const sessionValue = signSession(decoded.uid, exp);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionValue, {
      maxAge: FIVE_DAYS_S,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}

// DELETE /api/auth/session — sign out
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
