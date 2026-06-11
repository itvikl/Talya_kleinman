'use client';

import { useState } from 'react';
import { uploadProjectImage } from '@/lib/firebase';
import type { SiteSettings } from '@/types/database';
import { Upload, Check } from 'lucide-react';

const inputClass = 'w-full border border-cream-200 bg-cream-50 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brass/50 focus:bg-cream-50 placeholder:text-ink/50';
const labelClass = 'mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-ink/65';
const textareaClass = inputClass + ' resize-none';
const sectionHeadClass = 'mb-6 text-xs font-semibold text-ink/60 border-b border-cream-200 pb-3';

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
          <img src={currentUrl} alt="" className="h-40 w-full object-cover border border-cream-200" />
        )}
        {isUploading ? (
          <div className="rounded-lg border border-cream-200 bg-cream-100 px-4 py-3">
            <div className="mb-2 flex justify-between">
              <span className="text-xs text-ink/65">Uploading…</span>
              <span className="font-mono text-sm text-ink">{uploadPct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brass transition-all duration-150" style={{ width: `${uploadPct}%` }} />
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-cream-200 px-4 py-3 text-sm text-ink/65 transition-colors hover:border-brass/40 hover:bg-cream-100 hover:text-ink">
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

  const SaveBar = () => (
    <div className="sticky bottom-0 z-10 border-t border-cream-200 bg-cream-50/95 backdrop-blur-sm px-0 py-4 flex items-center gap-4">
      {error && <p className="text-sm text-red-400 flex-1">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !!uploadingField}
        className="ms-auto flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/80 disabled:opacity-50"
      >
        {saved ? <Check size={12} /> : null}
        {saving ? 'שומר…' : saved ? 'נשמר!' : 'שמור שינויים'}
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-10 pb-4">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* ── Hero ── */}
      <section>
        <h2 className={sectionHeadClass}>מסך ראשי — Hero</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>תמונה ראשית</label>
            <ImageUploadField fieldKey="hero_image" label="העלה תמונת רקע" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>טאגליין (עברית)</label>
              <textarea rows={3} className={textareaClass} dir="rtl"
                value={form.hero_tagline_he}
                onChange={(e) => set('hero_tagline_he', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tagline (English)</label>
              <textarea rows={3} className={textareaClass}
                value={form.hero_tagline_en}
                onChange={(e) => set('hero_tagline_en', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── About on homepage ── */}
      <section>
        <h2 className={sectionHeadClass}>מסך ראשי — על הסטודיו (ציטוט)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>טקסט (עברית)</label>
            <textarea rows={4} className={textareaClass} dir="rtl"
              value={form.home_about_body_he}
              onChange={(e) => set('home_about_body_he', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Text (English)</label>
            <textarea rows={4} className={textareaClass}
              value={form.home_about_body_en}
              onChange={(e) => set('home_about_body_en', e.target.value)} />
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section>
        <h2 className={sectionHeadClass}>פס מרקיז (רצועת הטקסט הגולל)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>טקסט (עברית)</label>
            <input className={inputClass} dir="rtl"
              value={form.marquee_he}
              onChange={(e) => set('marquee_he', e.target.value)}
              placeholder="אדריכלות פנים · עיצוב יוקרה · ..." />
          </div>
          <div>
            <label className={labelClass}>Text (English)</label>
            <input className={inputClass}
              value={form.marquee_en}
              onChange={(e) => set('marquee_en', e.target.value)}
              placeholder="Interior Architecture · Luxury Residences · ..." />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <h2 className={sectionHeadClass}>נתונים סטטיסטיים (דף הבית)</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {(
            [
              { key: 'stat_projects', label: 'פרויקטים' },
              { key: 'stat_years',    label: 'שנות ניסיון' },
              { key: 'stat_cities',   label: 'ערים' },
              { key: 'stat_clients',  label: 'לקוחות מרוצים (%)' },
            ] as { key: keyof SiteSettings; label: string }[]
          ).map(({ key, label }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                className={inputClass}
                value={form[key] as number}
                onChange={(e) => set(key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── About page ── */}
      <section>
        <h2 className={sectionHeadClass}>עמוד אודות</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>תמונה</label>
            <ImageUploadField fieldKey="about_image" label="העלה תמונת אודות" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>טקסט (עברית)</label>
              <textarea rows={5} className={textareaClass} dir="rtl"
                value={form.about_body_he}
                onChange={(e) => set('about_body_he', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Text (English)</label>
              <textarea rows={5} className={textareaClass}
                value={form.about_body_en}
                onChange={(e) => set('about_body_en', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section>
        <h2 className={sectionHeadClass}>פרטי יצירת קשר (עמוד קשר + פוטר)</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>טלפון</label>
              <input className={inputClass} value={form.contact_phone}
                onChange={(e) => set('contact_phone', e.target.value)}
                placeholder="+972 50-123-4567" />
            </div>
            <div>
              <label className={labelClass}>מייל</label>
              <input className={inputClass} type="email" value={form.contact_email}
                onChange={(e) => set('contact_email', e.target.value)}
                placeholder="studio@example.com" />
            </div>
          </div>
          <div>
            <label className={labelClass}>לינק אינסטגרם</label>
            <input className={inputClass} value={form.contact_instagram}
              onChange={(e) => set('contact_instagram', e.target.value)}
              placeholder="https://www.instagram.com/..." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>כתובת (עברית)</label>
              <input className={inputClass} dir="rtl" value={form.contact_address_he}
                onChange={(e) => set('contact_address_he', e.target.value)}
                placeholder="ירושלים, ישראל" />
            </div>
            <div>
              <label className={labelClass}>Address (English)</label>
              <input className={inputClass} value={form.contact_address_en}
                onChange={(e) => set('contact_address_en', e.target.value)}
                placeholder="Jerusalem, Israel" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>שעות — שורה 1 (עברית)</label>
              <input className={inputClass} dir="rtl" value={form.contact_hours1_he}
                onChange={(e) => set('contact_hours1_he', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Hours — line 1 (English)</label>
              <input className={inputClass} value={form.contact_hours1_en}
                onChange={(e) => set('contact_hours1_en', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>שעות — שורה 2 (עברית)</label>
              <input className={inputClass} dir="rtl" value={form.contact_hours2_he}
                onChange={(e) => set('contact_hours2_he', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Hours — line 2 (English)</label>
              <input className={inputClass} value={form.contact_hours2_en}
                onChange={(e) => set('contact_hours2_en', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Quote ── */}
      <section>
        <h2 className={sectionHeadClass}>ציטוט בפוטר</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>ציטוט (עברית)</label>
            <textarea rows={2} className={textareaClass} dir="rtl"
              value={form.footer_quote_he}
              onChange={(e) => set('footer_quote_he', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Quote (English)</label>
            <textarea rows={2} className={textareaClass}
              value={form.footer_quote_en}
              onChange={(e) => set('footer_quote_en', e.target.value)} />
          </div>
        </div>
      </section>

      {/* ── Work Process ── */}
      <section>
        <h2 className={sectionHeadClass}>תהליך עבודה — 4 שלבים</h2>
        <div className="space-y-6">
          {([
            { n: 1, prefix: 'wp1', label: 'שלב 1 — פגישת היכרות' },
            { n: 2, prefix: 'wp2', label: 'שלב 2 — תכנון ועיצוב' },
            { n: 3, prefix: 'wp3', label: 'שלב 3 — ליווי ביצוע' },
            { n: 4, prefix: 'wp4', label: 'שלב 4 — מסירה' },
          ] as { n: number; prefix: 'wp1' | 'wp2' | 'wp3' | 'wp4'; label: string }[]).map(({ prefix, label }) => (
            <div key={prefix} className="border border-cream-200 p-4 space-y-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-ink/50" style={{ fontFamily: 'var(--font-montserrat)' }}>{label}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>כותרת (עברית)</label>
                  <input className={inputClass} dir="rtl"
                    value={form[`${prefix}_title_he` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_title_he` as keyof SiteSettings, e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Title (English)</label>
                  <input className={inputClass}
                    value={form[`${prefix}_title_en` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_title_en` as keyof SiteSettings, e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>תיאור (עברית)</label>
                  <textarea rows={2} className={textareaClass} dir="rtl"
                    value={form[`${prefix}_desc_he` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_desc_he` as keyof SiteSettings, e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Description (English)</label>
                  <textarea rows={2} className={textareaClass}
                    value={form[`${prefix}_desc_en` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_desc_en` as keyof SiteSettings, e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Before & After ── */}
      <section>
        <h2 className={sectionHeadClass}>לפני ואחרי — 2 זוגות תמונות</h2>
        <div className="space-y-8">
          {([
            { prefix: 'ba1', label: 'זוג 1' },
            { prefix: 'ba2', label: 'זוג 2' },
          ] as { prefix: 'ba1' | 'ba2'; label: string }[]).map(({ prefix, label }) => (
            <div key={prefix} className="border border-cream-200 p-4 space-y-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-ink/50" style={{ fontFamily: 'var(--font-montserrat)' }}>{label}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>תמונת לפני</label>
                  <ImageUploadField fieldKey={`${prefix}_before_url` as keyof SiteSettings} label="העלה תמונת לפני" />
                </div>
                <div>
                  <label className={labelClass}>תמונת אחרי</label>
                  <ImageUploadField fieldKey={`${prefix}_after_url` as keyof SiteSettings} label="העלה תמונת אחרי" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>כותרת (עברית)</label>
                  <input className={inputClass} dir="rtl"
                    value={form[`${prefix}_title_he` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_title_he` as keyof SiteSettings, e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Title (English)</label>
                  <input className={inputClass}
                    value={form[`${prefix}_title_en` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_title_en` as keyof SiteSettings, e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>מטא (שנה + מ"ר) עברית</label>
                  <input className={inputClass} dir="rtl"
                    value={form[`${prefix}_meta_he` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_meta_he` as keyof SiteSettings, e.target.value)}
                    placeholder='2024 · 145 מ"ר' />
                </div>
                <div>
                  <label className={labelClass}>Meta (year + sqm) English</label>
                  <input className={inputClass}
                    value={form[`${prefix}_meta_en` as keyof SiteSettings] as string}
                    onChange={(e) => set(`${prefix}_meta_en` as keyof SiteSettings, e.target.value)}
                    placeholder="2024 · 145 sqm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SaveBar />
    </div>
  );
}
