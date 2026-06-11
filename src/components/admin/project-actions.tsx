'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  projectId: string;
  published: boolean;
  title: string;
}

export function ProjectActions({ projectId, published, title }: Props) {
  const [isPublished, setIsPublished] = useState(published);
  const [toggling, setToggling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function togglePublished() {
    setToggling(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !isPublished }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('Toggle failed:', body);
        alert('שגיאה בשמירה: ' + (body.error ?? res.status));
        setToggling(false);
        return;
      }
      setIsPublished((p) => !p);
      router.refresh();
    } catch (err) {
      console.error('Toggle error:', err);
      alert('שגיאת רשת');
    }
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/projects/${projectId}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <>
      {/* Status toggle */}
      <button
        onClick={togglePublished}
        disabled={toggling}
        style={{ fontFamily: 'var(--font-montserrat)' }}
        className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] transition-colors disabled:opacity-40 ${
          isPublished ? 'text-emerald-600 hover:text-red-400' : 'text-ink/60 hover:text-emerald-500'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-ink/25'}`} />
        {isPublished ? 'Live' : 'Draft'}
      </button>

      {/* Edit + Delete */}
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/projects/${projectId}`}
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-ink/65 transition-colors hover:text-brass"
        >
          <Pencil size={10} />
          Edit
        </Link>

        <button
          onClick={() => setConfirmDelete(true)}
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-ink/55 transition-colors hover:text-red-400"
        >
          <Trash2 size={10} />
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-cream-200 bg-cream-50 p-8">
            <h3 className="mb-2 font-serif text-lg font-light text-ink">Delete Project?</h3>
            <p className="mb-6 text-sm text-ink/65">
              &ldquo;{title}&rdquo; will be permanently removed along with all its images.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 py-2.5 text-[11px] uppercase tracking-wider text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="flex-1 border border-cream-200 py-2.5 text-[11px] uppercase tracking-wider text-ink/65 transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
