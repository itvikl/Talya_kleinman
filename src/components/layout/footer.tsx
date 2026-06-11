'use client';

import Link from 'next/link';
import { Instagram, Mail, Phone } from 'lucide-react';
import { useLocale, useT } from '@/lib/i18n-context';
import { useSiteSettings } from '@/lib/settings-context';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export function Footer() {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const t = useT();
  const isHe = locale === 'he';
  const router = useRouter();
  const settings = useSiteSettings();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phone = settings?.contact_phone ?? '+972 50-123-4567';
  const email = settings?.contact_email ?? 'studio@talyazaltsman.com';
  const instagram = settings?.contact_instagram ?? 'https://www.instagram.com/talya_zaltsman_interiors/';
  const address = isHe ? (settings?.contact_address_he ?? 'ירושלים, ישראל') : (settings?.contact_address_en ?? 'Jerusalem, Israel');
  const footerQuote = isHe ? (settings?.footer_quote_he ?? '"החללים שאנו חיים בהם, משפיעים ישירות על חיינו."') : (settings?.footer_quote_en ?? '"The spaces we live in directly shape our lives."');

  function handleSecretClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 3000);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      router.push('/admin/login');
    }
  }

  const navLinks = [
    { href: `/${locale}/projects`, label: t('nav.projects') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  return (
    <footer className="bg-ink text-cream-100/70">

      {/* Top divider with logo block */}
      <div className="container-editorial pt-20 pb-16">
        <div className="mb-16 flex flex-col gap-6 border-b border-cream-100/8 pb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="font-serif font-light text-cream-100 leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Talya Zaltsman
            </p>
            <p
              className="mt-3 text-[9px] uppercase tracking-[0.35em] text-cream-100/30"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'אדריכלות פנים ועיצוב · מאז 2009' : 'Interior Architecture & Design · Est. 2009'}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-cream-100/35 transition-colors duration-300 hover:text-brass"
            >
              <Instagram size={15} />
              <span
                className="text-[9px] uppercase tracking-[0.25em]"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Instagram
              </span>
            </a>
            <span className="h-3 w-px bg-cream-100/15" />
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-2 text-cream-100/35 transition-colors duration-300 hover:text-brass"
            >
              <Mail size={15} />
              <span
                className="text-[9px] uppercase tracking-[0.25em]"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Email
              </span>
            </a>
            <span className="h-3 w-px bg-cream-100/15" />
            <a
              href={`tel:${phone.replace(/[\s\-]/g, '')}`}
              className="group flex items-center gap-2 text-cream-100/35 transition-colors duration-300 hover:text-brass"
            >
              <Phone size={15} />
              <span
                className="text-[9px] uppercase tracking-[0.25em]"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {isHe ? 'טלפון' : 'Phone'}
              </span>
            </a>
          </div>
        </div>

        {/* Nav grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Col 1 — Contact info */}
          <div className="space-y-5">
            <p
              className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'סטודיו' : 'Studio'}
            </p>
            <div className="space-y-2">
              <p className="font-serif text-base text-cream-100/60">{address}</p>
              <a
                href={`mailto:${email}`}
                className="block font-serif text-base text-cream-100/60 transition-colors hover:text-brass"
              >
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/[\s\-]/g, '')}`}
                className="block font-serif text-base text-cream-100/60 transition-colors hover:text-brass"
              >
                {phone}
              </a>
            </div>
          </div>

          {/* Col 2 — Nav */}
          <nav className="space-y-5">
            <p
              className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'ניווט' : 'Navigate'}
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="editorial-link w-fit text-cream-100/50 transition-colors hover:text-cream-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Col 3 — Tagline */}
          <div className="space-y-5">
            <p
              className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'הסטודיו' : 'About us'}
            </p>
            <blockquote className="font-serif text-base leading-relaxed text-cream-100/40 italic">
              {footerQuote}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream-100/6">
        <div className="container-editorial flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p
            className="text-[9px] text-cream-100/20 select-none"
            style={{ fontFamily: 'var(--font-montserrat)', cursor: 'default' }}
            onClick={handleSecretClick}
          >
            &copy; {year} Talya Zaltsman Studio.{' '}
            {isHe ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
          </p>
          <p
            className="text-[9px] uppercase tracking-[0.25em] text-cream-100/15"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Jerusalem &middot; Israel
          </p>
        </div>
      </div>
    </footer>
  );
}
