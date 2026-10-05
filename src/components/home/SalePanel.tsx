import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductImage } from '@/components/ui/ProductImage';
import { Price } from '@/components/ui/Price';

/**
 * İndirim bölümü: solda vermilyon blok, sağda indirimdeki ürünler. Satırlar
 * alanı eşit doldurur — az ürün olduğunda sağda boşluk kalmaz.
 */
export function SalePanel({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  const best = Math.max(...products.map((p) => p.discountPercent));
  const shown = products.slice(0, 4);

  return (
    <section aria-labelledby="sale-title" className="container-page py-6">
      <div className="grid overflow-hidden rounded-[6px] border-2 border-fg lg:grid-cols-[1fr_1.3fr]">
        <div className="relative flex flex-col justify-between gap-12 overflow-hidden bg-hazard p-8 text-white sm:p-12">
          {/* Sağ alt köşede çapraz çizgi dokusu — dekoratif. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-2/3 opacity-20 [background:repeating-linear-gradient(-45deg,#fff_0_2px,transparent_2px_14px)] [mask-image:linear-gradient(to_top_left,black,transparent_70%)]"
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
              <span className="h-2 w-2 animate-pulse-slow rounded-full bg-white" aria-hidden="true" /> Sınırlı süre
            </p>
            {/* Satır aralığı İ'nin noktasına yer bırakır (etiketle çakışmasın). */}
            <h2 id="sale-title" className="mt-9 font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-[1]">
              İndirim
            </h2>
          </div>
          <div className="relative">
            <p className="font-display text-6xl leading-none">%{best}’e varan</p>
            <p className="mt-2 text-sm text-white/85">{products.length} üründe kampanya fiyatı</p>
            <Link href="/kampanyalar" className="btn mt-6 h-12 bg-fg px-6 text-bg hover:bg-white hover:text-fg">
              Tüm indirimler <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col bg-surface">
          <ul className="flex flex-1 flex-col divide-y divide-line">
            {shown.map((p, i) => (
              <li key={p.id} className="flex flex-1">
                <Link href={`/urun/${p.slug}`} className="group flex flex-1 items-center gap-5 p-5 transition-colors hover:bg-bg sm:p-6">
                  <span className="num w-6 text-sm text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[4px] bg-surface-2">
                    <ProductImage src={p.image} alt={p.imageAlt} sizes="96px" className="p-1.5 transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0 flex-1">
                    {p.series && <span className="block truncate text-[11px] font-bold tracking-[0.08em] text-muted">{p.series}</span>}
                    <span className="mt-0.5 block truncate text-lg font-semibold group-hover:text-accent">{p.name}</span>
                    <Price className="mt-1" size="sm" priceMinor={p.priceMinor} compareAtMinor={p.compareAtMinor} />
                  </span>
                  <span className="flex flex-col items-end gap-2">
                    <span className="num text-4xl leading-none text-hazard">-%{p.discountPercent}</span>
                    <ArrowUpRight size={18} className="text-subtle transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/kampanyalar"
            className="flex min-h-14 items-center justify-between border-t-2 border-fg px-6 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-fg hover:text-bg"
          >
            Tüm indirimli ürünler ({products.length})
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
