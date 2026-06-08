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
        className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider transition-colors disabled:opacity-40 ${
          isPublished ? 'text-emerald-500 hover:text-red-400' : 'text-neutral-500 hover:text-emerald-400'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
        {isPublished ? 'Live' : 'Draft'}
      </button>

      {/* Edit + Delete */}
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/projects/${projectId}`}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-white"
        >
          <Pencil size={11} />
          Edit
        </Link>

        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-600 transition-colors hover:text-red-400"
        >
          <Trash2 size={11} />
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-neutral-800 bg-neutral-900 p-8">
            <h3 className="mb-2 font-serif text-lg font-light text-neutral-100">Delete Project?</h3>
            <p className="mb-6 text-sm text-neutral-500">
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
                className="flex-1 border border-neutral-700 py-2.5 text-[11px] uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
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
