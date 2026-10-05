'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

/** Tek satırlık, sırayla değişen duyuru. Hareket azaltma tercihinde sabit kalır. */
export function AnnouncementBar() {
  const items = site.announcements;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="bg-fg text-bg">
      <div className="container-page flex h-9 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.16em]">
        <p key={i} className="animate-fade-up truncate">
          {items[i]}
        </p>
      </div>
    </div>
  );
}
