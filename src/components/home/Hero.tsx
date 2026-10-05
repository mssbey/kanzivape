import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductImage } from '@/components/ui/ProductImage';
import { Price } from '@/components/ui/Price';

/**
 * Editoryal giriş: dev başlık, dönen yazı halkalı vermilyon disk içinde öne çıkan ürün,
 * kenarda dikey yazı ve altta sürekli kayan bilgi şeridi.
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

        <div className="relative mx-auto w-full max-w-[540px]">
          {spotlight ? (
            <Link href={`/urun/${spotlight.slug}`} className="group relative block aspect-square" aria-label={`Öne çıkan: ${spotlight.name}`}>
              {/* Dönen yazı halkası — dekoratif. textLength yazıyı çevreye (2π·92 ≈ 578) tam yayar. */}
              <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full animate-[spin_36s_linear_infinite] text-fg group-hover:[animation-play-state:paused]">
                <defs>
                  <path id="kv-ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
                </defs>
                <text className="fill-current font-sans text-[8px] font-bold">
                  <textPath href="#kv-ring" textLength="576" lengthAdjust="spacing">BU HAFTANIN SEÇİMİ ✦ KANZIVAPE ✦ BU HAFTANIN SEÇİMİ ✦ KANZIVAPE ✦ </textPath>
                </text>
              </svg>
              {/* Vermilyon güneş diski ve içinde yuvarlak kırpılmış ürün görseli. */}
              <div aria-hidden="true" className="absolute inset-[9%] rounded-full bg-hazard" />
              <div className="absolute inset-[15%] overflow-hidden rounded-full border-[6px] border-bg bg-surface-2 shadow-[0_30px_60px_-25px_rgba(21,23,29,0.55)]">
                <ProductImage
                  src={spotlight.image}
                  alt={spotlight.imageAlt}
                  sizes="(min-width: 1024px) 380px, 70vw"
                  priority
                  className="object-cover p-0 transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-[4%] right-0 w-56 -rotate-2 border-2 border-fg bg-bg p-4 shadow-[6px_6px_0_0_#15171D] transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hazard">Haftanın seçimi</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold">{spotlight.name}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Price size="sm" priceMinor={spotlight.priceMinor} compareAtMinor={spotlight.compareAtMinor} />
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative grid aspect-square place-items-center">
              <div aria-hidden="true" className="absolute inset-[9%] rounded-full bg-hazard" />
              <p aria-hidden="true" className="relative font-display text-8xl text-white">
                KANZI
              </p>
            </div>
          )}
        </div>
      </div>

      <FactsTicker productCount={productCount} />
    </section>
  );
}

/** Hero altındaki bilgi şeridi — sürekli kayar; üzerine gelince durur. */
function FactsTicker({ productCount }: { productCount: number }) {
  const facts: [string, string][] = [
    ['Seçki', `${productCount} ürün`],
    ['Kargo', '1–3 iş günü'],
    ['Ödeme', '3D Secure'],
    ['Paket', 'Gizli & sızdırmaz'],
    ['Taksit', 'Kredi kartına'],
    ['Destek', 'Hafta içi her gün'],
  ];
  return (
    <div className="group relative overflow-hidden border-t-2 border-fg bg-bg">
      {/* Ekran okuyucu için tek, sabit liste. */}
      <dl className="sr-only">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div aria-hidden="true" className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {facts.map(([k, v]) => (
              <div key={`${copy}-${k}`} className="flex items-center gap-8 border-r-2 border-fg px-8 py-4 sm:px-12">
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{k}</span>
                  <span className="mt-1 block whitespace-nowrap font-display text-2xl uppercase leading-none sm:text-3xl">{v}</span>
                </span>
                <span className="h-3 w-3 rotate-45 bg-hazard" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
