'use client';

// KanziVape ürün kartı: çerçevesiz, kağıt zeminde görsel; üzerine gelince
// görselin altından "hızlı ekle" ya da "seçenekleri gör" çubuğu kayar.

import Link from 'next/link';
import Image from 'next/image';
import type { ProductCardData } from '@/lib/product';
import { useCart } from '@/store/cart';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { ProductImage } from '@/components/ui/ProductImage';
import { cn } from '@/lib/utils';

const SIZES = '(min-width: 1280px) 300px, (min-width: 768px) 30vw, 46vw';

export function ProductCard({ product, priority, className, index }: { product: ProductCardData; priority?: boolean; className?: string; index?: number }) {
  const add = useCart((s) => s.add);
  const href = `/urun/${product.slug}`;
  const tags = product.badges.filter((b) => b !== 'indirim');

  return (
    <article className={cn('group relative flex flex-col', !product.inStock && 'opacity-75', className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-surface-2">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <ProductImage
            src={product.image}
            alt={product.imageAlt}
            sizes={SIZES}
            priority={priority}
            className={cn('p-6 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.06]', product.hoverImage && 'group-hover:opacity-0')}
          />
          {product.hoverImage && (
            <Image src={product.hoverImage} alt="" fill sizes={SIZES} className="object-contain p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1">
          {tags.map((b) => (
            <Badge key={b} kind={b} />
          ))}
          {product.discountPercent > 0 && <Badge kind="indirim" label={`-%${product.discountPercent}`} />}
        </div>
        {typeof index === 'number' && (
          <span aria-hidden="true" className="num pointer-events-none absolute right-3 top-2 text-2xl text-fg/15">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {/* Masaüstünde hover'da kayan eylem çubuğu; dokunmatikte her zaman görünür. */}
        <div className="absolute inset-x-2 bottom-2 transition-transform duration-300 ease-out [@media(hover:hover)]:translate-y-[calc(100%+12px)] [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0">
          {product.quickAddVariantId ? (
            <button
              type="button"
              className="btn-primary h-11 w-full"
              aria-label={`${product.name} sepete ekle`}
              onClick={() =>
                add({
                  variantId: product.quickAddVariantId!,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  variantLabel: '',
                  image: product.image,
                  priceMinor: product.priceMinor,
                })
              }
            >
              Hızlı ekle
            </button>
          ) : (
            <Link href={href} className="btn h-11 w-full bg-fg text-bg hover:bg-accent" tabIndex={-1}>
              {product.inStock ? 'Seçenekleri gör' : 'Tükendi'}
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        {product.series && <p className="truncate text-[11px] font-bold tracking-[0.08em] text-muted">{product.series}</p>}
        <h3 className="mt-1 font-sans text-[15px] font-semibold normal-case leading-snug text-fg">
          <Link href={href} className="line-clamp-2 decoration-hazard decoration-2 underline-offset-4 group-hover:underline">
            {product.name}
          </Link>
        </h3>
        <Price className="mt-2" size="sm" priceMinor={product.priceMinor} compareAtMinor={product.compareAtMinor} maxPriceMinor={product.maxPriceMinor} />
      </div>
    </article>
  );
}
