import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductImage } from '@/components/ui/ProductImage';
import { Price } from '@/components/ui/Price';

/**
 * Editoryal giriş: dev başlık, vermilyon "güneş" diski üstünde öne çıkan ürün,
 * kenarda dikey yazı ve altta çizgili bilgi tablosu.
 */
export function Hero({ spotlight, productCount }: { spotlight: ProductCardData | undefined; productCount: number }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-fg">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <span aria-hidden="true" className="vertical-text pointer-events-none absolute left-3 top-10 hidden text-[10px] font-bold uppercase tracking-[0.5em] text-muted xl:block">
        <span lang="en">KANZIVAPE</span> — İstanbul — 2026
      </span>

      <div className="container-page relative grid items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.25fr_1fr] lg:pb-16 lg:pt-14">
        <div className="relative z-10 animate-fade-up">
          <p className="eyebrow">
            <span className="h-2 w-2 bg-hazard" aria-hidden="true" /> Likit · Pod · Aksesuar
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.5rem,10vw,8.75rem)] uppercase leading-[0.96]">
            Sade
            <br />
            seçki.
            <br />
            <span className="text-accent">Net aroma.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted sm:text-lg">
            Az ama doğru ürün. Her likiti tadıp seçiyor, sızdırmaz ve gizli paketle kapına gönderiyoruz.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/urunler" className="btn-primary h-14 px-8">
              Mağazaya gir <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/kampanyalar" className="btn-secondary h-14 px-8">
              İndirimler
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          {/* Vermilyon güneş diski — dekoratif. */}
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hazard" />
          {spotlight ? (
            <Link href={`/urun/${spotlight.slug}`} className="group relative block" aria-label={`Öne çıkan: ${spotlight.name}`}>
              <div className="relative mx-auto aspect-square w-[78%]">
                <ProductImage
                  src={spotlight.image}
                  alt={spotlight.imageAlt}
                  sizes="(min-width: 1024px) 420px, 80vw"
                  priority
                  className="rounded-[6px] p-2 drop-shadow-[0_30px_40px_rgba(21,23,29,0.35)] transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute -bottom-2 right-0 w-56 border-2 border-fg bg-bg p-4 shadow-[6px_6px_0_0_#15171D] transition-transform group-hover:-translate-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hazard">Bu haftanın seçimi</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold">{spotlight.name}</p>
                <Price className="mt-2" size="sm" priceMinor={spotlight.priceMinor} compareAtMinor={spotlight.compareAtMinor} />
              </div>
            </Link>
          ) : (
            <p aria-hidden="true" className="relative py-24 text-center font-display text-8xl text-white">
              KANZI
            </p>
          )}
        </div>
      </div>

      <dl className="relative grid grid-cols-2 border-t-2 border-fg sm:grid-cols-4">
        {[
          ['Seçki', `${productCount} ürün`],
          ['Kargo', '1–3 iş günü'],
          ['Ödeme', '3D Secure'],
          ['Paket', 'Gizli & sızdırmaz'],
        ].map(([k, v], i) => (
          <div key={k} className={`px-5 py-4 sm:px-8 ${i % 2 === 1 ? 'border-l-2 border-fg' : ''} ${i >= 2 ? 'border-t-2 border-fg sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l-2' : ''}`}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{k}</dt>
            <dd className="mt-1 font-display text-2xl uppercase leading-none sm:text-3xl">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
