import { getAllTestimonials } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { TestimonialsManager } from '@/components/admin/testimonials-manager';
import { Quote } from 'lucide-react';

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-10">

        <div className="mb-8 flex items-end justify-between border-b border-cream-200 pb-8">
          <div>
            <p
              className="mb-2 text-[9px] uppercase tracking-[0.3em] text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Studio Management
            </p>
            <h1
              className="font-serif font-light italic text-ink"
              style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontFamily: 'var(--font-serif)' }}
            >
              Testimonials
            </h1>
            <p
              className="mt-1 text-[9px] uppercase tracking-[0.2em] text-ink/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {testimonials.length} testimonials total
            </p>
          </div>
          <div className="flex items-center gap-2 text-ink/30">
            <Quote size={18} strokeWidth={1.2} />
          </div>
        </div>

        <TestimonialsManager initialTestimonials={testimonials} />

      </main>
    </div>
  );
}
