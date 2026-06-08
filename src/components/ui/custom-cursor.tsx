'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'image';

export function CustomCursor() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<CursorState>('default');

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);

  // Dot follows instantly
  const dotX = useSpring(mx, { stiffness: 2000, damping: 80 });
  const dotY = useSpring(my, { stiffness: 2000, damping: 80 });

  // Ring follows with deliberate lag
  const ringX = useSpring(mx, { stiffness: 180, damping: 28 });
  const ringY = useSpring(my, { stiffness: 180, damping: 28 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!ready) setReady(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.tagName === 'IMG' ||
        el.closest('[data-cursor-image]')
      ) {
        setState('image');
      } else if (
        el.closest('a') ||
        el.closest('button') ||
        el.closest('[data-cursor-expand]')
      ) {
        setState('hover');
      } else {
        setState('default');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [mx, my, ready]);

  if (!ready) return null;

  return (
    <>
      {/* Dot — instant follow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        aria-hidden
      >
        <motion.div
          className="rounded-full bg-brass"
          animate={{
            width: state === 'image' ? 0 : 5,
            height: state === 'image' ? 0 : 5,
            opacity: state === 'default' ? 0.9 : 0.5,
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Ring — lagged follow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        aria-hidden
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={{
            width: state === 'image' ? 80 : state === 'hover' ? 50 : 34,
            height: state === 'image' ? 80 : state === 'hover' ? 50 : 34,
            borderWidth: state === 'image' ? 1 : 1,
            borderColor:
              state === 'image'
                ? 'rgba(197,160,89,0.75)'
                : state === 'hover'
                ? 'rgba(154,123,79,0.6)'
                : 'rgba(154,123,79,0.4)',
            backgroundColor:
              state === 'image'
                ? 'rgba(197,160,89,0.06)'
                : 'transparent',
          }}
          style={{ borderStyle: 'solid' }}
          transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="text-[7px] uppercase tracking-[0.22em] text-brass/80 select-none"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            animate={{
              opacity: state === 'image' ? 1 : 0,
              scale: state === 'image' ? 1 : 0.7,
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            VIEW
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}
