// Allow self-signed / unverifiable certificates in local dev (corporate/VPN environments)
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// ── Use globalThis to survive Next.js HMR module reloads ─────────────────────
// Without this, module-level variables reset to null on every Hot Reload,
// causing "Firestore has already been initialized. You can only call settings()
// once" errors because Firebase's internal state persists across reloads.
const g = globalThis as typeof globalThis & {
  __firebase_admin_app?: App;
  __firebase_admin_auth?: Auth;
  __firebase_admin_db?: Firestore;
};

function getAdminApp(): App {
  if (g.__firebase_admin_app) return g.__firebase_admin_app;
  if (getApps().length) {
    g.__firebase_admin_app = getApps()[0];
    return g.__firebase_admin_app;
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env var is not set');
  }

  g.__firebase_admin_app = initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
  return g.__firebase_admin_app;
}

export function adminAuth(): Auth {
  if (!g.__firebase_admin_auth) {
    g.__firebase_admin_auth = getAuth(getAdminApp());
  }
  return g.__firebase_admin_auth;
}

export function adminDb(): Firestore {
  if (!g.__firebase_admin_db) {
    g.__firebase_admin_db = getFirestore(getAdminApp());
    // Use REST instead of gRPC — gRPC ignores NODE_TLS_REJECT_UNAUTHORIZED,
    // REST uses Node's native HTTPS which respects it (needed in dev with corporate SSL).
    // Wrapped in try/catch because two concurrent calls (e.g. Promise.all) can
    // both see g.__firebase_admin_db as undefined and both attempt settings(),
    // but Firebase only allows settings() once. The first call wins; the second
    // is safely swallowed — preferRest is already applied.
    try {
      g.__firebase_admin_db.settings({ preferRest: true });
    } catch {
      // settings() already applied — either by a concurrent call or after HMR
    }
  }
  return g.__firebase_admin_db;
}
