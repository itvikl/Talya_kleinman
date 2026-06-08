'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n-context';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const t = useT();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-brass/30 bg-cream-200/40 p-12 text-center">
        <p className="font-serif text-3xl text-ink">{t('contact.successTitle')}</p>
        <p className="mt-4 text-ink-muted">{t('contact.successBody')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full border-b border-ink/20 bg-transparent py-3 text-ink placeholder:text-ink-subtle focus:border-brass focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label className="text-eyebrow mb-3 block">{t('contact.name')} *</label>
        <input {...register('name')} className={inputClass} type="text" />
        {errors.name && <p className="mt-2 text-xs text-red-700">{t('contact.requiredField')}</p>}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label className="text-eyebrow mb-3 block">{t('contact.phone')} *</label>
          <input {...register('phone')} className={inputClass} type="tel" />
          {errors.phone && <p className="mt-2 text-xs text-red-700">{t('contact.requiredField')}</p>}
        </div>
        <div>
          <label className="text-eyebrow mb-3 block">{t('contact.email')}</label>
          <input {...register('email')} className={inputClass} type="email" />
        </div>
      </div>

      <div>
        <label className="text-eyebrow mb-3 block">{t('contact.message')}</label>
        <textarea {...register('message')} rows={4} className={`${inputClass} resize-none`} />
      </div>

      {status === 'error' && <p className="text-sm text-red-700">{t('contact.errorMessage')}</p>}

      <div className="pt-4">
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? t('contact.submitting') : t('contact.submit')}
        </Button>
      </div>
    </form>
  );
}
