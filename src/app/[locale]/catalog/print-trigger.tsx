'use client';

import Link from 'next/link';
import { Download, X } from 'lucide-react';

export function PrintTrigger({ isHe }: { isHe: boolean }) {
  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between bg-ink px-6 py-3 print:hidden">
      <p
        className="text-[9px] uppercase tracking-[0.3em] text-white/40"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {isHe ? 'קטלוג עבודות — טליה זלצמן' : 'Portfolio Catalog — Talya Zaltsman'}
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-brass"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <Download size={12} />
          {isHe ? 'הורד PDF' : 'Download PDF'}
        </button>
        <Link
          href="javascript:history.back()"
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/60"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <X size={12} />
          {isHe ? 'סגור' : 'Close'}
        </Link>
      </div>
    </div>
  );
}
