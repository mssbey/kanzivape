import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductImage } from '@/components/ui/ProductImage';
import { Price } from '@/components/ui/Price';

/** İndirim bölümü: solda vermilyon blok, sağda indirimdeki ürünlerin listesi. */
export function SalePanel({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  const best = Math.max(...products.map((p) => p.discountPercent));
  return (
    <section aria-labelledby="sale-title" className="container-page py-6">
      <div className="grid overflow-hidden rounded-[6px] border-2 border-fg lg:grid-cols-[1fr_1.3fr]">
        <div className="relative flex flex-col justify-between gap-10 bg-hazard p-8 text-white sm:p-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Sınırlı süre</p>
            <h2 id="sale-title" className="mt-3 font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.85]">
              İndirim
            </h2>
          </div>
          <div>
            <p className="font-display text-6xl leading-none">%{best}’e varan</p>
            <Link href="/kampanyalar" className="btn mt-6 h-12 bg-fg px-6 text-bg hover:bg-white hover:text-fg">
              Tüm indirimler <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ul className="divide-y divide-line bg-surface">
          {products.slice(0, 4).map((p) => (
            <li key={p.id}>
              <Link href={`/urun/${p.slug}`} className="group flex items-center gap-4 p-4 transition-colors hover:bg-bg sm:p-5">
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[4px] bg-surface-2">
                  <ProductImage src={p.image} alt={p.imageAlt} sizes="80px" className="p-1.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold group-hover:text-accent">{p.name}</span>
                  <Price className="mt-1" size="sm" priceMinor={p.priceMinor} compareAtMinor={p.compareAtMinor} />
                </span>
                <span className="num text-3xl text-hazard">-%{p.discountPercent}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
