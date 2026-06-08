import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  const color = inverted ? 'text-cream-100 border-cream-100/40 group-hover:border-cream-100' : 'text-ink border-ink/30 group-hover:border-brass group-hover:text-brass';

  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label="Talya Zaltsman — Home"
    >
      <span className={cn('flex h-9 w-9 items-center justify-center border transition-colors duration-500', color)}>
        <span className="font-serif text-base tracking-tight">TZ</span>
      </span>
      <span className="hidden flex-col leading-tight md:flex">
        <span className={cn('font-serif text-sm tracking-editorial uppercase transition-colors duration-500', inverted ? 'text-cream-100' : 'text-ink')}>
          Talya Zaltsman
        </span>
        <span className={cn('text-[10px] tracking-wider-em uppercase transition-colors duration-500', inverted ? 'text-cream-100/50' : 'text-ink-muted')}>
          Architecture &middot; Interior Design
        </span>
      </span>
    </Link>
  );
}
