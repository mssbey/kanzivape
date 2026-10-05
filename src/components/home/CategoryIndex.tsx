import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CategoryNode } from '@/storefront/catalog';

/** Kategoriler: numaralı, büyük tipografik liste — dergi içindekiler sayfası gibi. */
export function CategoryIndex({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;
  return (
    <section aria-labelledby="cat-title" className="container-page py-14 sm:py-20">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">İçindekiler</p>
          <h2 id="cat-title" className="text-display-md">
            Kategoriler
          </h2>
        </div>
        <Link href="/kategori" className="btn-ghost hidden sm:inline-flex">
          Tümü <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ol className="border-t-2 border-fg">
        {categories.slice(0, 8).map((c, i) => (
          <li key={c.id} className="border-b border-line">
            <Link href={`/kategori/${c.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-surface sm:grid-cols-[4rem_1fr_auto_auto] sm:py-7">
              <span className="num text-lg text-subtle sm:pl-3">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="block font-display text-4xl uppercase leading-none transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-accent sm:text-6xl">
                  {c.name}
                </span>
                {c.tagline && <span className="mt-2 block truncate text-sm text-muted">{c.tagline}</span>}
              </span>
              <span className="num hidden text-lg text-muted sm:block">{c.productCount} ürün</span>
              <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-fg transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink sm:mr-3">
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
