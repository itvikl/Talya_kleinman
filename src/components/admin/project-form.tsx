'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { uploadProjectImage } from '@/lib/firebase';
import type { DbProject, DbProjectImage, ProjectCategory } from '@/types/database';
import { Trash2, Upload, GripVertical, Eye, Settings2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ProjFormData = Omit<DbProject, 'id' | 'created_at' | 'updated_at'>;

// ── Sortable image card (admin grid) ──────────────────────────────────────────
function SortableImageCard({
  img,
  onDelete,
}: {
  img: DbProjectImage;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 50 : undefined,
      }}
      className={`group relative border ${isDragging ? 'border-brass/40 shadow-lg shadow-slate-200' : 'border-cream-200'} bg-cream-50`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.url} alt="" className="h-32 w-full object-cover" />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 cursor-grab active:cursor-grabbing rounded bg-cream-50/70 p-1 opacity-0 transition-opacity group-hover:opacity-100"
        title="גרור לסידור מחדש"
      >
        <GripVertical size={13} className="text-ink/60" />
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(img.id)}
        className="absolute right-1 top-1 rounded bg-cream-50/70 p-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 size={12} className="text-red-400" />
      </button>

      {/* Sort order badge */}
      <div className="absolute bottom-1 right-1 rounded bg-cream-50/60 px-1.5 py-0.5">
        <span className="font-mono text-[9px] text-ink/65">
          {String(img.sort_order + 1 || 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// ── Preview: client-facing asymmetric gallery layout ─────────────────────────
function PreviewGallery({ images }: { images: DbProjectImage[] }) {
  if (!images.length) return (
    <p className="py-6 text-center text-xs text-ink/60">אין תמונות בגלריה</p>
  );

  const groups: { imgs: DbProjectImage[]; hasTall: boolean }[] = [];
  let i = 0;
  while (i < images.length) {
    const remaining = images.length - i;
    if (remaining >= 3) {
      const size = remaining >= 5 ? 5 : 3;
      groups.push({ imgs: images.slice(i, i + size), hasTall: size === 5 });
      i += size;
    } else {
      groups.push({ imgs: images.slice(i), hasTall: false });
      i = images.length;
    }
  }

  return (
    <div className="space-y-1 rounded border border-cream-200 overflow-hidden">
      {groups.map((group, gi) => (
        <div
          key={gi}
          className={group.hasTall ? 'grid grid-cols-3 grid-rows-2 gap-1' : 'grid grid-cols-3 gap-1'}
          style={group.hasTall ? { gridAutoRows: '140px' } : { gridAutoRows: '180px' }}
        >
          {group.imgs.map((img, idx) => (
            <div
              key={img.id}
              className={`relative overflow-hidden bg-cream-200 ${group.hasTall && idx === 0 ? 'row-span-2' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5">
                <span className="font-mono text-[8px] text-white/50">{String(idx + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface Props {
  projectId?: string;
  initialData?: Partial<ProjFormData>;
  initialImages?: DbProjectImage[];
}

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'warm', label: 'Warm Living' },
  { value: 'statement', label: 'Statement' },
  { value: 'glamour', label: 'Glamour' },
];

const inputClass = 'w-full border border-cream-200 bg-cream-50 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brass/50 focus:bg-cream-50 placeholder:text-ink/50';
const labelClass = 'mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-ink/65';

function UploadProgressBar({
  progress,
  label,
}: {
  progress: { current: number; total: number; pct: number };
  label: string;
}) {
  const isMultiple = progress.total > 1;
  return (
    <div className="border border-cream-200 bg-cream-50 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-ink/65">
          {isMultiple
            ? `Uploading ${progress.current} / ${progress.total}`
            : `Uploading ${label}`}
        </span>
        <span className="font-mono text-sm text-ink">{progress.pct}%</span>
      </div>
      {/* Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
        <div
          className="h-full rounded-full bg-brass transition-all duration-150"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
      {isMultiple && (
        <div className="mt-2 h-0.5 w-full overflow-hidden bg-cream-200">
          <div
            className="h-full bg-brass/50 transition-all duration-300"
            style={{ width: `${((progress.current - 1) / progress.total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function ProjectForm({ projectId, initialData, initialImages = [] }: Props) {
  const router = useRouter();
  const isEditing = !!projectId;

  const [form, setForm] = useState<ProjFormData>({
    slug: initialData?.slug ?? '',
    category: initialData?.category ?? 'warm',
    year: initialData?.year ?? new Date().getFullYear(),
    area_sqm: initialData?.area_sqm ?? null,
    location_he: initialData?.location_he ?? '',
    location_en: initialData?.location_en ?? '',
    title_he: initialData?.title_he ?? '',
    title_en: initialData?.title_en ?? '',
    description_he: initialData?.description_he ?? '',
    description_en: initialData?.description_en ?? '',
    cover_image: initialData?.cover_image ?? '',
    before_image: initialData?.before_image ?? '',
    sort_order: initialData?.sort_order ?? 0,
    published: initialData?.published ?? false,
  });

  const [images, setImages] = useState<DbProjectImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; pct: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [galleryView, setGalleryView] = useState<'admin' | 'preview'>('admin');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const saveOrder = useCallback(async (ordered: DbProjectImage[]) => {
    if (!projectId) return;
    await fetch('/api/admin/project-images/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ordered.map((i) => i.id) }),
    });
  }, [projectId]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        sort_order: idx,
      }));
      saveOrder(reordered);
      return reordered;
    });
  }

  function set<K extends keyof ProjFormData>(key: K, value: ProjFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleEnChange(value: string) {
    set('title_en', value);
    if (!isEditing) {
      set('slug', value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress({ current: 1, total: 1, pct: 0 });
    try {
      const url = await uploadProjectImage(file, form.slug || 'new', (pct) =>
        setUploadProgress({ current: 1, total: 1, pct })
      );
      console.log('[cover] uploaded URL:', url);
      set('cover_image', url);
    } catch (err) {
      console.error('[cover] upload error:', err);
      setError('Cover image upload failed: ' + String(err));
    }
    setUploading(false);
    setUploadProgress(null);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    // Track per-file progress, average for the bar
    const perFile = new Array(files.length).fill(0);
    const folder = projectId ?? form.slug ?? 'new';

    const updateProgress = (i: number, pct: number) => {
      perFile[i] = pct;
      const avg = Math.round(perFile.reduce((a, b) => a + b, 0) / files.length);
      setUploadProgress({ current: perFile.filter((p) => p === 100).length + 1, total: files.length, pct: avg });
    };

    try {
      // Upload all files in parallel
      const urls = await Promise.all(
        files.map((file, i) =>
          uploadProjectImage(file, folder, (pct) => updateProgress(i, pct))
        )
      );

      if (projectId) {
        const results = await Promise.all(
          urls.map((url, i) =>
            fetch('/api/admin/project-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project_id: projectId, url, alt_he: '', alt_en: '', sort_order: images.length + i }),
            }).then((r) => r.json())
          )
        );
        setImages((prev) => [
          ...prev,
          ...results.map((r, i) => ({
            id: r.id,
            project_id: projectId,
            url: urls[i],
            alt_he: '',
            alt_en: '',
            sort_order: prev.length + i,
            created_at: '',
          })),
        ]);
      } else {
        const now = Date.now();
        setImages((prev) => [
          ...prev,
          ...urls.map((url, i) => ({
            id: `temp-${now}-${i}`,
            project_id: '',
            url,
            alt_he: '',
            alt_en: '',
            sort_order: prev.length + i,
            created_at: '',
          })),
        ]);
      }
    } catch {
      setError('Gallery upload failed.');
    }
    setUploading(false);
    setUploadProgress(null);
  }

  async function handleDeleteImage(imageId: string) {
    if (imageId.startsWith('temp-')) {
      setImages((prev) => prev.filter((i) => i.id !== imageId));
      return;
    }
    await fetch(`/api/admin/project-images/${imageId}`, { method: 'DELETE' });
    setImages((prev) => prev.filter((i) => i.id !== imageId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    console.log('[submit] form.cover_image =', form.cover_image);

    try {
      if (isEditing) {
        const res = await fetch(`/api/admin/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const body = await res.json();
        console.log('[submit] PATCH response:', body);
        if (!res.ok) { setError('Save failed: ' + body.error); setSaving(false); return; }
      } else {
        const payload = JSON.stringify(form);
        console.log('[submit] POST payload cover_image:', form.cover_image);
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });
        const body = await res.json();
        console.log('[submit] POST response:', body);
        const { id: newId } = body;

        const tempImages = images.filter((i) => i.id.startsWith('temp-'));
        if (tempImages.length && newId) {
          await Promise.all(
            tempImages.map((img, idx) =>
              fetch('/api/admin/project-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: newId, url: img.url, alt_he: '', alt_en: '', sort_order: idx }),
              })
            )
          );
        }
      }

      router.push('/admin/projects');
      router.refresh();
    } catch {
      setError('Save failed. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Core */}
      <section>
        <h2 className="mb-5 text-[10px] uppercase tracking-widest text-ink/65">Core Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className={labelClass}>Title (EN)</label>
            <input className={inputClass} required value={form.title_en} onChange={(e) => handleTitleEnChange(e.target.value)} /></div>
          <div><label className={labelClass}>Title (HE)</label>
            <input className={inputClass} required value={form.title_he} onChange={(e) => set('title_he', e.target.value)} dir="rtl" /></div>
          <div><label className={labelClass}>Slug</label>
            <input className={inputClass} required value={form.slug} onChange={(e) => set('slug', e.target.value)} /></div>
          <div><label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value as ProjectCategory)}>
              {CATEGORIES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select></div>
          <div><label className={labelClass}>Year</label>
            <input type="number" className={inputClass} required value={form.year} min={2000} max={2100}
              onChange={(e) => set('year', parseInt(e.target.value))} /></div>
          <div><label className={labelClass}>Area (sqm)</label>
            <input type="number" className={inputClass} value={form.area_sqm ?? ''} placeholder="e.g. 180"
              onChange={(e) => set('area_sqm', e.target.value ? parseInt(e.target.value) : null)} /></div>
          <div><label className={labelClass}>Location (EN)</label>
            <input className={inputClass} required value={form.location_en} onChange={(e) => set('location_en', e.target.value)} /></div>
          <div><label className={labelClass}>Location (HE)</label>
            <input className={inputClass} required value={form.location_he} onChange={(e) => set('location_he', e.target.value)} dir="rtl" /></div>
        </div>
      </section>

      {/* Descriptions */}
      <section>
        <h2 className="mb-5 text-[10px] uppercase tracking-widest text-ink/65">Description</h2>
        <div className="grid gap-4">
          <div><label className={labelClass}>Description (EN)</label>
            <textarea rows={4} className={inputClass} required value={form.description_en}
              onChange={(e) => set('description_en', e.target.value)} /></div>
          <div><label className={labelClass}>Description (HE)</label>
            <textarea rows={4} className={inputClass} required value={form.description_he}
              onChange={(e) => set('description_he', e.target.value)} dir="rtl" /></div>
        </div>
      </section>

      {/* Cover */}
      <section>
        <h2 className="mb-5 text-[10px] uppercase tracking-widest text-ink/65">Cover Image</h2>
        {form.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.cover_image} alt="" className="mb-3 h-40 w-full object-cover border border-cream-200" />
        )}
        {uploadProgress && uploading ? (
          <UploadProgressBar progress={uploadProgress} label="cover" />
        ) : (
          <label className="flex cursor-pointer items-center gap-3 border border-dashed border-cream-200 px-4 py-3 text-sm text-ink/65 transition-colors hover:border-brass/40 hover:text-ink/60">
            <Upload size={14} />
            Upload cover image
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        )}
        <div className="mt-2">
          <label className={labelClass}>Or enter URL</label>
          <input className={inputClass} value={form.cover_image} placeholder="https://…"
            onChange={(e) => set('cover_image', e.target.value)} />
        </div>
      </section>

      {/* Before Image (optional — for comparison slider) */}
      <section>
        <h2 className="mb-1 text-[10px] uppercase tracking-widest text-ink/65">Before Image <span className="normal-case text-ink/60">(optional — for Before/After slider)</span></h2>
        {form.before_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.before_image} alt="before" className="mb-3 h-32 w-full object-cover border border-cream-200 opacity-70" />
        )}
        <div className="mt-2">
          <input className={inputClass} value={form.before_image ?? ''} placeholder="https://… (URL of the before image)"
            onChange={(e) => set('before_image', e.target.value || undefined)} />
        </div>
      </section>

      {/* Gallery */}
      <section>
        {/* Header + toggle */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-widest text-ink/65">
            Gallery Images
            {images.length > 0 && (
              <span className="ml-2 text-ink/60">({images.length})</span>
            )}
          </h2>
          {images.length > 0 && (
            <div className="flex items-center gap-1 rounded border border-cream-200 p-0.5">
              <button
                type="button"
                onClick={() => setGalleryView('admin')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  galleryView === 'admin'
                    ? 'bg-slate-700 text-white'
                    : 'text-ink/60 hover:text-ink/60'
                }`}
              >
                <Settings2 size={10} />
                ניהול
              </button>
              <button
                type="button"
                onClick={() => setGalleryView('preview')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  galleryView === 'preview'
                    ? 'bg-slate-700 text-white'
                    : 'text-ink/60 hover:text-ink/60'
                }`}
              >
                <Eye size={10} />
                תצוגה מקדימה
              </button>
            </div>
          )}
        </div>

        {/* Admin: DnD grid */}
        {galleryView === 'admin' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="mb-3 grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <SortableImageCard key={img.id} img={img} onDelete={handleDeleteImage} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Preview: client-facing layout */}
        {galleryView === 'preview' && (
          <div className="mb-3">
            <p className="mb-2 text-[9px] uppercase tracking-widest text-ink/60">
              כך תיראה הגלריה באתר
            </p>
            <PreviewGallery images={images} />
          </div>
        )}

        {uploadProgress && uploading ? (
          <UploadProgressBar progress={uploadProgress} label="gallery" />
        ) : (
          <label className="flex cursor-pointer items-center gap-3 border border-dashed border-cream-200 px-4 py-3 text-sm text-ink/65 transition-colors hover:border-brass/40 hover:text-ink/60">
            <Upload size={14} />
            Upload gallery images (multiple)
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
          </label>
        )}
      </section>

      {/* Settings */}
      <section>
        <h2 className="mb-5 text-[10px] uppercase tracking-widest text-ink/65">Settings</h2>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published}
            onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-white" />
          <label htmlFor="published" className="text-sm text-ink/60">Published (visible on site)</label>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Sort Order</label>
          <input type="number" className={`${inputClass} w-24`} value={form.sort_order}
            onChange={(e) => set('sort_order', parseInt(e.target.value))} />
        </div>
      </section>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={saving || uploading}
          className="bg-cream-50 px-8 py-2.5 text-[11px] uppercase tracking-wider text-ink transition-opacity disabled:opacity-50">
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Project'}
        </button>
        <button type="button" onClick={() => router.push('/admin/projects')}
          className="border border-cream-200 px-6 py-2.5 text-[11px] uppercase tracking-wider text-ink/65 transition-colors hover:text-ink/60">
          Cancel
        </button>
      </div>
    </form>
  );
}
