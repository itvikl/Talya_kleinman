'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { DbProjectImage } from '@/types/database';

function GalleryItem({
  img,
  index,
  isHe,
  tall,
}: {
  img: DbProjectImage;
  index: number;
  isHe: boolean;
  tall?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.85,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative overflow-hidden rounded-2xl bg-cream-200 ${tall ? 'row-span-2' : ''}`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={img.url}
          alt={isHe ? img.alt_he || '' : img.alt_en || ''}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
        />
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-700 group-hover:bg-black/10" />
      </div>
    </motion.div>
  );
}

export function ProjectGallery({
  images,
  locale,
}: {
  images: DbProjectImage[];
  locale: string;
}) {
  const isHe = locale === 'he';
  if (!images.length) return null;

  // Group images: every 5 = [tall, sq, sq, sq, sq], remainder = rows of 3
  const groups: { imgs: DbProjectImage[]; hasTall: boolean }[] = [];
  let i = 0;
  while (i < images.length) {
    const remaining = images.length - i;
    if (remaining >= 3) {
      // Group of 5 (tall pattern) when we have enough, else group of 3
      const size = remaining >= 5 ? 5 : 3;
      groups.push({ imgs: images.slice(i, i + size), hasTall: size === 5 });
      i += size;
    } else {
      groups.push({ imgs: images.slice(i), hasTall: false });
      i = images.length;
    }
  }

  return (
    <section className="pb-24 md:pb-40">
      <div className="space-y-1">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className={
              group.hasTall
                ? 'grid grid-cols-3 grid-rows-2 gap-1'
                : 'grid grid-cols-3 gap-1'
            }
            style={group.hasTall ? { gridAutoRows: '200px' } : { gridAutoRows: '260px' }}
          >
            {group.imgs.map((img, idx) => (
              <GalleryItem
                key={img.id}
                img={img}
                index={idx}
                isHe={isHe}
                tall={group.hasTall && idx === 0}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
