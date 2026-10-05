import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductCardData } from '@/lib/product';
import { ProductCard } from '@/components/product/ProductCard';

/** Yeni gelenler: başlık solda sabit, ürünler sağda ızgara (asimetrik düzen). */
export function NewArrivals({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="new-title" className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-3">Taze stok</p>
          <h2 id="new-title" className="text-display-md">
            Yeni
            <br />
            gelenler
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted">Bu hafta rafa giren likitler ve cihazlar.</p>
          <Link href="/urunler?sirala=yeni" className="btn-secondary mt-6">
            Hepsini gör <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
