'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth, preloadFirebaseAuth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-warm Firebase Auth SDK so it's ready when the user submits
  useEffect(() => { preloadFirebaseAuth(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error('Session creation failed');

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ cursor: 'auto' }}>
      {/* Restore native cursor — globals.css hides it site-wide; the admin
          cursor component skips this page so we bring back the default. */}
      <style>{`@media (pointer: fine) { *, *::before, *::after { cursor: auto !important; } }`}</style>
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-neutral-700">
            <span className="font-serif text-lg tracking-tight">TZ</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Studio Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-widest text-neutral-500">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none transition-colors focus:border-neutral-600 placeholder:text-neutral-600"
              placeholder="studio@talyazaltsman.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-widest text-neutral-500">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none transition-colors focus:border-neutral-600"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-white py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-950 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
