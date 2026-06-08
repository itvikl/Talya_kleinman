import type { ReactNode } from 'react';

export function Marquee({
  children,
  className,
  reverse,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden ${className ?? ''}`}
      aria-hidden
      dir="ltr"
    >
      <div
        className={`flex whitespace-nowrap ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        <span className="flex items-center">{children}</span>
        <span className="flex items-center">{children}</span>
      </div>
    </div>
  );
}
