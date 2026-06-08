'use client';

import { useState } from 'react';
import { uploadProjectImage } from '@/lib/firebase';
import type { SiteSettings } from '@/types/database';
import { Upload, Check } from 'lucide-react';

const inputClass =
  'w-full border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none transition-colors focus:border-neutral-600 placeholder:text-neutral-600';
const labelClass = 'mb-1 block text-[10px] uppercase tracking-widest text-neutral-500';
const textareaClass = inputClass + ' resize-none';

interface Props {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: Props) {
  const [form, setForm] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SiteSettings
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    setUploadPct(0);
    try {
      const url = await uploadProjectImage(file, 'site', (pct) => setUploadPct(pct));
      set(field, url);
    } catch (err) {
      setError('Upload failed: ' + String(err));
    }
    setUploadingField(null);
    setUploadPct(0);
    e.target.value = '';
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json();
        setError('Save failed: ' + body.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError('Save failed: ' + String(err));
    }
    setSaving(false);
  }

  function ImageUploadField({
    fieldKey,
    label,
  }: {
    fieldKey: keyof SiteSettings;
    label: string;
  }) {
    const currentUrl = form[fieldKey] as string;
    const isUploading = uploadingField === fieldKey;

    return (
      <div className="space-y-2">
        {currentUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="h-40 w-full object-cover border border-neutral-800" />
        )}
        {isUploading ? (
          <div className="border border-neutral-800 bg-neutral-900 px-4 py-3">
            <div className="mb-2 flex justify-between">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">Uploading…</span>
              <span className="font-mono text-sm text-white">{uploadPct}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden bg-neutral-800">
              <div className="h-full bg-white transition-all duration-150" style={{ width: `${uploadPct}%` }} />
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-3 border border-dashed border-neutral-700 px-4 py-3 text-sm text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300">
            <Upload size={14} />
            {label}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, fieldKey)} />
          </label>
        )}
        <div>
          <label className={labelClass}>או הכנס URL</label>
          <input
            className={inputClass}
            value={currentUrl}
            placeholder="https://…"
            onChange={(e) => set(fieldKey, e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-10">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* ── Hero ── */}
      <section>
        <h2 className="mb-6 text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-3">
          מסך ראשי — Hero
        </h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>תמונה ראשית</label>
            <ImageUploadField fieldKey="hero_image" label="העלה תמונת רקע" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>טאגליין (עברית)</label>
              <textarea
                rows={3}
                className={textareaClass}
                dir="rtl"
                value={form.hero_tagline_he}
                onChange={(e) => set('hero_tagline_he', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline (English)</label>
              <textarea
                rows={3}
                className={textareaClass}
                value={form.hero_tagline_en}
                onChange={(e) => set('hero_tagline_en', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── About on homepage ── */}
      <section>
        <h2 className="mb-6 text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-3">
          מסך ראשי — על הסטודיו (ציטוט)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>טקסט (עברית)</label>
            <textarea
              rows={4}
              className={textareaClass}
              dir="rtl"
              value={form.home_about_body_he}
              onChange={(e) => set('home_about_body_he', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Text (English)</label>
            <textarea
              rows={4}
              className={textareaClass}
              value={form.home_about_body_en}
              onChange={(e) => set('home_about_body_en', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── About page ── */}
      <section>
        <h2 className="mb-6 text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-3">
          עמוד אודות
        </h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>תמונה</label>
            <ImageUploadField fieldKey="about_image" label="העלה תמונת אודות" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>טקסט (עברית)</label>
              <textarea
                rows={5}
                className={textareaClass}
                dir="rtl"
                value={form.about_body_he}
                onChange={(e) => set('about_body_he', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Text (English)</label>
              <textarea
                rows={5}
                className={textareaClass}
                value={form.about_body_en}
                onChange={(e) => set('about_body_en', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !!uploadingField}
          className="flex items-center gap-2 bg-white px-8 py-2.5 text-[11px] uppercase tracking-wider text-neutral-950 transition-opacity disabled:opacity-50"
        >
          {saved ? <Check size={12} /> : null}
          {saving ? 'שומר…' : saved ? 'נשמר!' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  );
}
