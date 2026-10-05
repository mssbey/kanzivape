'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/components/ui/ProductImage';
import { cn } from '@/lib/utils';

/**
 * Masaüstünde görseller alt alta (editoryal akış), mobilde tek görsel +
 * numaralı küçük seçiciler. Seçilen varyantın kendi görseli varsa öne çıkar.
 */
export function Gallery({ images, name, activeSrc }: { images: { src: string; alt: string }[]; name: string; activeSrc?: string | null }) {
  const [index, setIndex] = useState(0);
  const list = activeSrc && !images.some((i) => i.src === activeSrc) ? [{ src: activeSrc, alt: name }, ...images] : images;
  const shown = activeSrc ? Math.max(0, list.findIndex((i) => i.src === activeSrc)) : index;
  const ordered = list.length ? [list[shown], ...list.filter((_, i) => i !== shown)] : [{ src: '', alt: name }];

  return (
    <div>
      {/* Mobil: tek görsel + seçici */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-surface-2">
          <ProductImage key={list[shown]?.src} src={list[shown]?.src ?? ''} alt={list[shown]?.alt ?? name} sizes="100vw" priority className="animate-fade-up p-8" />
        </div>
        {list.length > 1 && (
          <ul className="mt-3 flex gap-2" aria-label="Ürün görselleri">
            {list.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Görsel ${i + 1}`}
                  aria-current={shown === i ? 'true' : undefined}
                  className={cn('relative h-16 w-16 overflow-hidden rounded-[4px] bg-surface-2 ring-2 transition', shown === i ? 'ring-fg' : 'ring-transparent')}
                >
                  <Image src={img.src} alt="" fill sizes="64px" className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Masaüstü: alt alta, ilk görsel seçili varyantınki */}
      <ul className="hidden space-y-4 lg:block" aria-label="Ürün görselleri">
        {ordered.map((img, i) => (
          <li key={`${img.src}-${i}`} className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-surface-2">
            <ProductImage src={img.src} alt={img.alt} sizes="(min-width: 1024px) 50vw, 100vw" priority={i === 0} className="p-12" />
            <span aria-hidden="true" className="num absolute bottom-4 left-5 text-sm text-fg/40">
              {String(i + 1).padStart(2, '0')} / {String(ordered.length).padStart(2, '0')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
