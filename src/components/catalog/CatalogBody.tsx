'use client';

// Mağaza gövdesi: yapışkan araç çubuğu (filtre, yoğunluk, sıralama) + ürün
// ızgarası. Filtre ve sıralama URL'de (paylaşılabilir, geri tuşu çalışır);
// ızgara yoğunluğu ziyaretçi tercihidir, tarayıcıda saklanır.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Check, ChevronDown, PackageSearch } from 'lucide-react';
import { SORTS, type ProductCardData, type SortKey } from '@/lib/product';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type Density = 2 | 3 | 4;
const DENSITY_KEY = 'kanzi-izgara';

const GRID: Record<Density, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

/** Yoğunluk simgesi: n sütunlu küçük ızgara. */
function DensityIcon({ n }: { n: Density }) {
  return (
    <span aria-hidden="true" className="grid h-3.5 gap-[2px]" style={{ gridTemplateColumns: `repeat(${n}, 4px)` }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="bg-current" />
      ))}
    </span>
  );
}

export function CatalogBody({
  products,
  offset,
  total,
  sort,
  emptyText,
  showPromo,
  saleCount,
}: {
  /** Bu sayfadaki ürünler. */
  products: ProductCardData[];
  /** Önceki sayfalardaki ürün sayısı — kart numaraları sayfalar arası sürer. */
  offset: number;
  /** Filtrelenmiş toplam ürün sayısı. */
  total: number;
  sort: SortKey;
  emptyText: string;
  /** Izgaraya kampanya kartı eklensin mi (kampanya sayfasının kendisinde hayır). */
  showPromo: boolean;
  saleCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [density, setDensity] = useState<Density>(4);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(DENSITY_KEY));
      if (v === 2 || v === 3 || v === 4) setDensity(v);
    } catch {
      // Depolama kapalı — varsayılan yoğunluk.
    }
  }, []);

  const chooseDensity = (n: Density) => {
    setDensity(n);
    try {
      localStorage.setItem(DENSITY_KEY, String(n));
    } catch {
      // yok say
    }
  };

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('sayfa');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggle = (key: string) => update(key, params.get(key) ? null : '1');

  const filters = [
    { key: 'stok', label: 'Stokta olanlar' },
    ...(pathname.startsWith('/kampanyalar') ? [] : [{ key: 'indirim', label: 'İndirimdekiler' }]),
  ];

  // Kampanya kartı 6. üründen sonra (iki sütun genişliğinde) araya girer.
  const promoAt = showPromo && saleCount > 0 && products.length > 6 ? 6 : -1;

  return (
    <>
      <div className="sticky top-[72px] z-30 -mx-5 border-b-2 border-fg bg-bg/95 px-5 backdrop-blur sm:mx-0 sm:px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
              const on = params.get(f.key) === '1';
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f.key)}
                  className={cn(
                    'inline-flex min-h-10 items-center gap-2 rounded-full border-2 px-4 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors',
                    on ? 'border-fg bg-fg text-bg' : 'border-line-strong text-muted hover:border-fg hover:text-fg',
                  )}
                >
                  <span className={cn('grid h-4 w-4 place-items-center rounded-full border', on ? 'border-bg bg-bg text-fg' : 'border-current')}>
                    {on && <Check size={11} strokeWidth={3} aria-hidden="true" />}
                  </span>
                  {f.label}
                </button>
              );
            })}
            <span className="num ml-1 text-lg text-muted" aria-live="polite">
              {total} <span className="font-sans text-xs font-semibold uppercase tracking-wider">ürün</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-full border-2 border-line-strong p-1 sm:flex" role="group" aria-label="Izgara yoğunluğu">
              {([2, 3, 4] as Density[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => chooseDensity(n)}
                  aria-pressed={density === n}
                  aria-label={`${n} sütun`}
                  className={cn('grid h-8 w-9 place-items-center rounded-full transition-colors', density === n ? 'bg-fg text-bg' : 'text-muted hover:text-fg')}
                >
                  <DensityIcon n={n} />
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                onBlur={(e) => !e.currentTarget.parentElement?.contains(e.relatedTarget as Node) && setSortOpen(false)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-fg px-4 text-[12px] font-bold uppercase tracking-[0.1em]"
              >
                <span className="text-muted">Sırala:</span> {SORTS[sort]}
                <ChevronDown size={15} className={cn('transition-transform', sortOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              {sortOpen && (
                <ul role="listbox" aria-label="Sıralama" className="absolute right-0 top-full z-40 mt-2 w-64 animate-fade-up overflow-hidden rounded-[6px] border-2 border-fg bg-surface shadow-[6px_6px_0_0_#15171D]">
                  {(Object.keys(SORTS) as SortKey[]).map((k) => (
                    <li key={k} role="option" aria-selected={k === sort}>
                      <button
                        type="button"
                        onClick={() => {
                          setSortOpen(false);
                          update('sirala', k === 'onerilen' ? null : k);
                        }}
                        className={cn('flex w-full min-h-11 items-center justify-between px-4 text-left text-sm transition-colors hover:bg-bg', k === sort && 'font-bold')}
                      >
                        {SORTS[k]}
                        {k === sort && <Check size={15} className="text-accent" aria-hidden="true" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {products.length === 0 ? (
          <EmptyState icon={PackageSearch} title="Ürün bulunamadı" description={emptyText} />
        ) : (
          <ul className={cn('grid gap-x-4 gap-y-12 sm:gap-x-6', GRID[density])}>
            {products.map((p, i) => (
              <ListItem key={p.id} product={p} index={offset + i} priority={i < 4} promo={i === promoAt ? saleCount : null} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ListItem({ product, index, priority, promo }: { product: ProductCardData; index: number; priority: boolean; promo: number | null }) {
  return (
    <>
      {promo !== null && (
        <li className="col-span-2">
          <Link
            href="/kampanyalar"
            className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[6px] border-2 border-fg bg-hazard p-8 text-white"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background:repeating-linear-gradient(-45deg,#fff_0_2px,transparent_2px_14px)]"
            />
            <span className="relative text-[11px] font-bold uppercase tracking-[0.22em]">Kampanya · {promo} ürün</span>
            <span className="relative">
              <span className="block font-display text-[clamp(3rem,6vw,5.5rem)] uppercase leading-[1]">İndirimdekiler</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
                Hepsini gör <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      )}
      <li>
        <ProductCard product={product} index={index} priority={priority} className="h-full" />
      </li>
    </>
  );
}
