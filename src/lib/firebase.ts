import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

function getApp(): FirebaseApp {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  });
}

export function getFirebaseAuth() {
  return getAuth(getApp());
}

export function getFirebaseStorage() {
  return getStorage(getApp());
}

/** Call on page mount to pre-warm the Firebase Auth SDK */
export function preloadFirebaseAuth() {
  if (typeof window === 'undefined') return;
  try { getFirebaseAuth(); } catch { /* env not ready at build time */ }
}

// ── Upload with progress callback ────────────────────────────────────────────
export async function uploadProjectImage(
  file: File,
  projectId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');

  const storage = getFirebaseStorage();
  const fileRef = ref(storage, `projects/${projectId}/${Date.now()}-${file.name}`);
  const task = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}
