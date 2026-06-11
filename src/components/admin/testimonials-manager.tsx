'use client';

import { useState } from 'react';
import type { DbTestimonial } from '@/types/database';
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Check, X } from 'lucide-react';

const inputClass = 'w-full border border-cream-200 bg-cream-50 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brass/50 placeholder:text-ink/50';
const labelClass = 'mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-ink/65';
const textareaClass = inputClass + ' resize-none';

type Draft = Omit<DbTestimonial, 'id'>;

const EMPTY_DRAFT: Draft = {
  text_he: '',
  text_en: '',
  name: '',
  project_title_he: '',
  project_title_en: '',
  sort_order: 0,
  published: true,
};

export function TestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: DbTestimonial[];
}) {
  const [items, setItems] = useState<DbTestimonial[]>(initialTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>({ ...EMPTY_DRAFT });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function saveNew() {
    if (!newDraft.name.trim() || !newDraft.text_he.trim()) {
      setError('שם ועדות בעברית הם שדות חובה');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newDraft, sort_order: items.length }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setItems((prev) => [...prev, { ...newDraft, id: body.id, sort_order: prev.length }]);
      setAdding(false);
      setNewDraft({ ...EMPTY_DRAFT });
    } catch (err) {
      setError(String(err));
    }
    setSaving(false);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...editDraft } : t)));
      setEditingId(null);
    } catch (err) {
      setError(String(err));
    }
    setSaving(false);
  }

  async function togglePublish(item: DbTestimonial) {
    const newVal = !item.published;
    try {
      await fetch(`/api/admin/testimonials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newVal }),
      });
      setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, published: newVal } : t)));
    } catch (err) {
      setError(String(err));
    }
  }

  async function remove(id: string) {
    if (!confirm('האם למחוק עדות זו?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(String(err));
    }
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = items.findIndex((t) => t.id === id);
    const newItems = [...items];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= newItems.length) return;
    [newItems[idx], newItems[swap]] = [newItems[swap], newItems[idx]];
    const updated = newItems.map((t, i) => ({ ...t, sort_order: i }));
    setItems(updated);
    await Promise.all(
      updated.map((t) =>
        fetch(`/api/admin/testimonials/${t.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: t.sort_order }),
        })
      )
    );
  }

  function startEdit(item: DbTestimonial) {
    setEditingId(item.id);
    setEditDraft({
      text_he: item.text_he,
      text_en: item.text_en,
      name: item.name,
      project_title_he: item.project_title_he ?? '',
      project_title_en: item.project_title_en ?? '',
      sort_order: item.sort_order,
      published: item.published,
    });
  }

  function TestimonialForm({
    draft,
    onChange,
    onSave,
    onCancel,
    label,
  }: {
    draft: Draft;
    onChange: (d: Draft) => void;
    onSave: () => void;
    onCancel: () => void;
    label: string;
  }) {
    return (
      <div className="border border-brass/30 bg-cream-50 p-6 space-y-5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-brass" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {label}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>עדות (עברית) *</label>
            <textarea
              rows={3}
              className={textareaClass}
              dir="rtl"
              value={draft.text_he}
              onChange={(e) => onChange({ ...draft, text_he: e.target.value })}
              placeholder="טקסט העדות בעברית"
            />
          </div>
          <div>
            <label className={labelClass}>Testimonial (English)</label>
            <textarea
              rows={3}
              className={textareaClass}
              value={draft.text_en}
              onChange={(e) => onChange({ ...draft, text_en: e.target.value })}
              placeholder="Testimonial text in English"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>שם הלקוח *</label>
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
              placeholder="שם מלא"
            />
          </div>
          <div>
            <label className={labelClass}>פרויקט (עברית)</label>
            <input
              className={inputClass}
              dir="rtl"
              value={draft.project_title_he ?? ''}
              onChange={(e) => onChange({ ...draft, project_title_he: e.target.value })}
              placeholder="למשל: דירה בתל אביב"
            />
          </div>
          <div>
            <label className={labelClass}>Project (English)</label>
            <input
              className={inputClass}
              value={draft.project_title_en ?? ''}
              onChange={(e) => onChange({ ...draft, project_title_en: e.target.value })}
              placeholder="e.g. Tel Aviv Apartment"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-ink/70">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => onChange({ ...draft, published: e.target.checked })}
              className="accent-brass"
            />
            <span className="text-[9px] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-montserrat)' }}>
              פורסם
            </span>
          </label>
          <div className="flex gap-2 ms-auto">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 border border-ink/20 px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-ink"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <X size={10} /> ביטול
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-ink px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-ink/80 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <Check size={10} /> שמור
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* List */}
      {items.length === 0 && !adding && (
        <div className="border border-cream-200 px-5 py-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50" style={{ fontFamily: 'var(--font-montserrat)' }}>
            אין עדויות עדיין.
          </p>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id}>
          {editingId === item.id ? (
            <TestimonialForm
              draft={editDraft}
              onChange={setEditDraft}
              onSave={() => saveEdit(item.id)}
              onCancel={() => setEditingId(null)}
              label="עריכת עדות"
            />
          ) : (
            <div className="border border-cream-200 bg-cream-50 px-5 py-4 transition-colors hover:bg-cream-100">
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(item.id, 'up')} className="text-ink/30 hover:text-ink transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => move(item.id, 'down')} className="text-ink/30 hover:text-ink transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    {item.project_title_he && (
                      <span className="text-[9px] uppercase tracking-[0.15em] text-brass/60" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {item.project_title_he}
                      </span>
                    )}
                    {!item.published && (
                      <span className="text-[8px] uppercase tracking-[0.15em] text-ink/35 border border-ink/20 px-1.5 py-0.5" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        טיוטה
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink/55 line-clamp-2" dir="rtl">{item.text_he}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(item)}
                    className="text-ink/30 hover:text-brass transition-colors"
                    title={item.published ? 'הסתר' : 'פרסם'}
                  >
                    {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="border border-ink/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-ink/60 transition-colors hover:border-brass hover:text-brass"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    עריכה
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-ink/25 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new */}
      {adding ? (
        <TestimonialForm
          draft={newDraft}
          onChange={setNewDraft}
          onSave={saveNew}
          onCancel={() => { setAdding(false); setNewDraft({ ...EMPTY_DRAFT }); setError(''); }}
          label="עדות חדשה"
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 border border-dashed border-ink/20 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-ink/50 transition-all w-full hover:border-brass/50 hover:text-brass"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <Plus size={11} /> הוסף עדות
        </button>
      )}
    </div>
  );
}
