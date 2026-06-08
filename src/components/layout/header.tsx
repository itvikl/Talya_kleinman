'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useT, useLocale } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const CATEGORIES = [
  { key: 'warm', labelHe: 'חמים וביתי', labelEn: 'Warm Living' },
  { key: 'statement', labelHe: 'סטייטמנט', labelEn: 'Statement' },
  { key: 'glamour', labelHe: 'גלאמור', labelEn: 'Glamour' },
] as const;

export function Header() {
  const t = useT();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectsHover, setProjectsHover] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHe = locale === 'he';
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogoSecretClick() {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 3000);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      router.push('/admin/login');
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: `/${locale}/projects`, label: t('nav.projects') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  const otherLocale = locale === 'he' ? 'en' : 'he';
  const otherLocalePath =
    locale === 'he' ? `/en${pathname}` : pathname.replace(/^\/en/, '') || '/';

  const isHero = pathname === `/${locale}` || pathname === '/';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-700',
        scrolled || open
          ? 'border-b border-ink/10 bg-cream-100/95 backdrop-blur-md'
          : isHero
          ? 'bg-transparent'
          : 'border-b border-ink/5 bg-cream-100/95 backdrop-blur-md',
      )}
    >
      <div className="container-editorial flex h-20 items-center justify-between">
        <div onClick={handleLogoSecretClick} className="select-none">
          <Logo inverted={!scrolled && !open && isHero} />
        </div>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const isProjects = item.href === '/projects';
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => {
                  if (hideTimer.current) clearTimeout(hideTimer.current);
                  if (isProjects) setProjectsHover(true);
                }}
                onMouseLeave={() => {
                  if (isProjects) {
                    hideTimer.current = setTimeout(() => setProjectsHover(false), 120);
                  }
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'editorial-link transition-colors duration-500',
                    !scrolled && isHero
                      ? 'text-cream-100/80 hover:text-cream-100'
                      : 'text-ink hover:text-brass',
                  )}
                >
                  {item.label}
                </Link>

                {isProjects && (
                  <AnimatePresence>
                    {projectsHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute start-0 top-full mt-4 z-50 min-w-[180px] rounded-xl border border-ink/8 bg-cream-100/98 backdrop-blur-md shadow-lg py-3 px-1"
                      >
                        {CATEGORIES.map((cat, i) => (
                          <Link
                            key={cat.key}
                            href={`/${locale}/projects?category=${cat.key}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-brass hover:bg-cream-200/60 rounded-lg"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                          >
                            <span className="font-serif italic text-brass/50 text-xs">{String(i + 1).padStart(2, '0')}</span>
                            {isHe ? cat.labelHe : cat.labelEn}
                          </Link>
                        ))}
                        <div className="mx-4 mt-2 border-t border-ink/8 pt-2">
                          <Link
                            href={`/${locale}/projects`}
                            className="flex items-center gap-2 px-0 py-1.5 text-[9px] uppercase tracking-[0.25em] text-ink/30 transition-colors hover:text-brass"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                          >
                            {isHe ? 'כל הפרויקטים' : 'All projects'} →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href={otherLocalePath}
            className={cn(
              'editorial-link transition-colors duration-500',
              !scrolled && isHero
                ? 'text-cream-100/60 hover:text-cream-100'
                : 'text-ink-muted hover:text-brass',
            )}
          >
            {t('common.languageSwitch')}
          </Link>
          <button
            className={cn(
              'md:hidden transition-colors',
              !scrolled && isHero ? 'text-cream-100' : 'text-ink',
            )}
            onClick={() => setOpen(!open)}
            aria-label={open ? t('common.close') : t('common.menu')}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden bg-cream-100 transition-[max-height] duration-500 ease-editorial md:hidden',
          open ? 'max-h-96 border-t border-ink/5' : 'max-h-0',
        )}
      >
        <nav className="container-editorial flex flex-col gap-6 py-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="editorial-link text-ink"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
