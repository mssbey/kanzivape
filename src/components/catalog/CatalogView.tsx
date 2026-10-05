import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ProductCardData, SortKey } from '@/lib/product';
import { getRootCategories, listProducts } from '@/storefront/catalog';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';
import { CatalogBody } from './CatalogBody';
import { Pagination } from './Pagination';

export const PAGE_SIZE = 24;

/**
 * Mağaza sayfalarının ortak düzeni (tüm ürünler, kategori, indirim, arama):
 * dev başlık + sayı, kategori sekmeleri, yapışkan araç çubuğu, ızgara, sayfalama.
 */
export async function CatalogView({
  title,
  eyebrow,
  description,
  crumbs,
  products,
  sort,
  page,
  basePath,
  params,
  children,
  activeRootSlug,
  emptyText = 'Bu seçimde ürün bulunamadı. Filtreleri değiştirmeyi dene.',
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  crumbs: Crumb[];
  products: ProductCardData[];
  sort: SortKey;
  page: number;
  basePath: string;
  params: Record<string, string | undefined>;
  /** Başlık altında, sekmelerden sonra (alt kategori çipleri vb.). */
  children?: ReactNode;
  /** Kategori sayfasında, sekmelerde vurgulanacak kök kategori. */
  activeRootSlug?: string;
  emptyText?: string;
}) {
  const [roots, onSale] = await Promise.all([getRootCategories(), listProducts({ onlySale: true, onlyInStock: true })]);
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  const offset = (current - 1) * PAGE_SIZE;
  const slice = products.slice(offset, offset + PAGE_SIZE);
  const allActive = basePath === '/urunler';
  const tabCls = (active: boolean) =>
    cn(
      'relative inline-flex min-h-12 shrink-0 items-baseline gap-1.5 py-2 font-display text-2xl uppercase transition-colors sm:text-3xl',
      active ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-hazard' : 'text-subtle hover:text-fg',
    );

  return (
    <div className="container-page pb-6 pt-6">
      <Breadcrumbs items={crumbs} />

      <header className="mt-8 grid gap-6 border-b-2 border-fg pb-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-end">
        <div>
          {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
          <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] uppercase leading-[1]">
            {title}
            <sup className="num ml-2 align-super text-[0.28em] text-hazard">({String(products.length).padStart(2, '0')})</sup>
          </h1>
        </div>
        {description && <p className="text-base leading-7 text-muted lg:pb-3">{description}</p>}
      </header>

      {roots.length > 0 && (
        <nav aria-label="Kategoriler" className="no-scrollbar -mx-5 mt-4 flex gap-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <Link href="/urunler" aria-current={allActive ? 'page' : undefined} className={tabCls(allActive)}>
            Tümü
          </Link>
          {roots.map((c) => {
            const active = activeRootSlug === c.slug;
            return (
              <Link key={c.id} href={`/kategori/${c.slug}`} aria-current={active ? 'page' : undefined} className={tabCls(active)}>
                {c.name}
                <span className="num text-sm text-subtle">{c.productCount}</span>
              </Link>
            );
          })}
          <Link href="/kampanyalar" aria-current={basePath === '/kampanyalar' ? 'page' : undefined} className={cn(tabCls(basePath === '/kampanyalar'), 'text-hazard hover:text-hazard')}>
            İndirim
          </Link>
        </nav>
      )}

      {children && <div className="mt-5">{children}</div>}

      <div className="mt-4">
        <CatalogBody
          products={slice}
          offset={offset}
          total={products.length}
          sort={sort}
          emptyText={emptyText}
          showPromo={basePath !== '/kampanyalar'}
          saleCount={onSale.length}
        />
      </div>

      <Pagination page={current} pageCount={pageCount} basePath={basePath} params={params} />
    </div>
  );
}

export type CatalogSearchParams = Promise<Record<string, string | string[] | undefined>>;

/** URL parametrelerini tek değerli düz nesneye indirger. */
export function flatParams(raw: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}
