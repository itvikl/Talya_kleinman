'use client';

import { useEffect, useRef } from 'react';

export function FloatingOrnament() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kill all motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number;
    let lastY = -1;

    const tick = () => {
      const sy = window.scrollY;
      if (wrapRef.current && sy !== lastY) {
        lastY = sy;
        // Factor 0.3 → drifts at 30% of scroll speed — slow, cinematic
        wrapRef.current.style.transform = `translateY(${sy * 0.3}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Keyframes injected once — CSS animation for rotation + breathing */}
      <style>{`
        @keyframes orn-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes orn-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .orn-spin, .orn-breathe {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Parallax wrapper — translateY driven by rAF */}
      <div
        ref={wrapRef}
        className="orn-breathe pointer-events-none fixed hidden md:block"
        style={{
          top: '10vh',
          right: '2.5vw',
          zIndex: 1,
          opacity: 0.28,
          willChange: 'transform',
          animation: 'orn-breathe 9s ease-in-out infinite',
        }}
        aria-hidden
      >
        {/* SVG rotates independently inside the breathing/parallax wrapper */}
        <svg
          width="96"
          height="96"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="orn-spin"
          style={{
            animation: 'orn-spin 54s linear infinite',
            display: 'block',
          }}
        >
          {/* Outer thin ring */}
          <circle
            cx="50" cy="50" r="47"
            stroke="rgba(197,160,89,1)"
            strokeWidth="0.75"
          />
          {/* Inner concentric ring */}
          <circle
            cx="50" cy="50" r="34"
            stroke="rgba(197,160,89,1)"
            strokeWidth="0.45"
          />
          {/* 4 cardinal accent dots — sit exactly on the outer ring */}
          <circle cx="50"  cy="3"   r="1.5" fill="rgba(197,160,89,1)" />
          <circle cx="50"  cy="97"  r="1.5" fill="rgba(197,160,89,1)" />
          <circle cx="3"   cy="50"  r="1.5" fill="rgba(197,160,89,1)" />
          <circle cx="97"  cy="50"  r="1.5" fill="rgba(197,160,89,1)" />
          {/* 4 diagonal micro-dots at 45° — subtler */}
          <circle cx="83.2" cy="16.8" r="0.9" fill="rgba(197,160,89,0.55)" />
          <circle cx="16.8" cy="16.8" r="0.9" fill="rgba(197,160,89,0.55)" />
          <circle cx="83.2" cy="83.2" r="0.9" fill="rgba(197,160,89,0.55)" />
          <circle cx="16.8" cy="83.2" r="0.9" fill="rgba(197,160,89,0.55)" />
        </svg>
      </div>
    </>
  );
}
