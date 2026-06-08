'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface Props {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({ before, after, beforeLabel = 'לפני', afterLabel = 'אחרי' }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - left) / width) * 100));
    setPosition(pct);
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative select-none overflow-hidden rounded-2xl cursor-col-resize"
      style={{ aspectRatio: '4/3' }}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* After — base layer */}
      <div className="absolute inset-0">
        <Image src={after} alt={afterLabel} fill className="object-cover" sizes="(min-width: 768px) 70vw, 100vw" />
      </div>

      {/* Before — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image src={before} alt={beforeLabel} fill className="object-cover" sizes="(min-width: 768px) 70vw, 100vw" />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-20 -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="h-full w-[2px] bg-white/70" />
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 bg-black/30 backdrop-blur-sm shadow-lg">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 7H1M1 7L3 5M1 7L3 9M10 7H13M13 7L11 5M13 7L11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 start-4 z-10 pointer-events-none">
        <span
          className="rounded-lg bg-black/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 end-4 z-10 pointer-events-none">
        <span
          className="rounded-lg bg-black/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
