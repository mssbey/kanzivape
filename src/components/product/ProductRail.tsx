'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductCard } from './ProductCard';

/** Yatay kayan ürün rayı — başlıkta ürün sayısı, sağda oklar. */
export function ProductRail({ title, eyebrow, href, products }: { title: string; eyebrow?: string; href?: string; products: ProductCardData[] }) {
  const ref = useRef<HTMLUListElement>(null);
  if (products.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  const titleId = `rail-${title.replace(/\s+/g, '-').toLocaleLowerCase('tr')}`;

  return (
    <section aria-labelledby={titleId} className="container-page py-14 sm:py-20">
      <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-fg pb-4">
        <div>
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 id={titleId} className="text-display-md">
            {title} <sup className="num align-super text-[0.35em] text-muted">({String(products.length).padStart(2, '0')})</sup>
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {href && (
            <Link href={href} className="btn-ghost hidden sm:inline-flex">
              Tümü <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <button type="button" onClick={() => scroll(-1)} className="btn-ghost hidden w-11 px-0 md:inline-flex" aria-label={`${title}: geri kaydır`}>
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="btn-ghost hidden w-11 px-0 md:inline-flex" aria-label={`${title}: ileri kaydır`}>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:mx-0 sm:gap-6 sm:px-0">
        {products.map((p, i) => (
          <li key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-[23%]">
            <ProductCard product={p} index={i} className="h-full" />
          </li>
        ))}
      </ul>
      {href && (
        <Link href={href} className="btn-secondary mt-8 w-full sm:hidden">
          Tümünü gör
        </Link>
      )}
    </section>
  );
}
