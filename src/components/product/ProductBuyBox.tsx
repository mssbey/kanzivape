'use client';

// Ürün sayfasının etkileşimli bölümü: galeri (solda) + yapışkan satın alma
// paneli (sağda).
//
// Varyant seçimi: her seçenek için bir değer seçilir; eşleşen aktif varyant
// fiyatı, stoğu ve (varsa) görseli belirler. Diğer seçimlerle hiç eşleşmeyen
// değerler devre dışı, eşleşip stokta olmayanlar üstü çizili görünür.

import { useMemo, useState, type ReactNode } from 'react';
import { ShoppingBag } from 'lucide-react';
import type { ProductDetailData, VariantView } from '@/lib/product';
import { discountPercentMinor } from '@/lib/money';
import { useCart } from '@/store/cart';
import { toast } from '@/store/toast';
import { Price } from '@/components/ui/Price';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { cn } from '@/lib/utils';
import { Gallery } from './Gallery';

type Selection = Record<string, string>;

const TASTE_LABELS: [keyof ProductDetailData['taste'], string][] = [
  ['sweetness', 'Tatlılık'],
  ['freshness', 'Ferahlık'],
  ['intensity', 'Yoğunluk'],
  ['sourness', 'Ekşilik'],
  ['creaminess', 'Kremsilik'],
];

function initialSelection(p: ProductDetailData): Selection {
  const start = p.variants.find((v) => v.isDefault && v.inStock) ?? p.variants.find((v) => v.inStock) ?? p.variants[0];
  return start ? { ...start.optionValues } : {};
}

function matches(v: VariantView, sel: Selection): boolean {
  return Object.entries(sel).every(([optionId, valueId]) => v.optionValues[optionId] === valueId);
}

export function ProductBuyBox({ product, children }: { product: ProductDetailData; children?: ReactNode }) {
  const add = useCart((s) => s.add);
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(() => (product.options.length ? product.variants.find((v) => matches(v, selection)) : product.variants[0]), [product, selection]);
  const complete = product.options.every((o) => selection[o.id]);
  const maxQty = variant?.stockLeft != null ? Math.max(1, Math.min(20, variant.stockLeft)) : 20;

  const valueState = (optionId: string, valueId: string): 'ok' | 'stokta-yok' | 'yok' => {
    const candidates = product.variants.filter((v) => matches(v, { ...selection, [optionId]: valueId }));
    if (!candidates.length) return 'yok';
    return candidates.some((v) => v.inStock) ? 'ok' : 'stokta-yok';
  };

  const choose = (optionId: string, valueId: string) => {
    let next = { ...selection, [optionId]: valueId };
    if (!product.variants.some((v) => matches(v, next))) {
      const fallback =
        product.variants.find((v) => v.optionValues[optionId] === valueId && v.inStock) ?? product.variants.find((v) => v.optionValues[optionId] === valueId);
      if (fallback) next = { ...fallback.optionValues };
    }
    setSelection(next);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!variant || !variant.inStock) return;
    add(
      {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variantLabel: variant.label,
        image: variant.image ?? product.image,
        priceMinor: variant.priceMinor,
      },
      quantity,
    );
    toast.success('Sepete eklendi', `${product.name}${variant.label ? ` · ${variant.label}` : ''} × ${quantity}`);
  };

  const priceMinor = variant?.priceMinor ?? product.priceMinor;
  const compareAt = variant ? variant.compareAtMinor : product.compareAtMinor;
  const discount = discountPercentMinor(priceMinor, compareAt);
  const canBuy = Boolean(variant?.inStock) && complete;
  const lowStock = variant?.stockLeft != null && variant.stockLeft > 0 && variant.stockLeft <= 5;
  const hasTaste = TASTE_LABELS.some(([k]) => (product.taste?.[k] ?? 0) > 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <Gallery images={product.images} name={product.name} activeSrc={variant?.image} />

      <div className="pb-28 lg:pb-0">
        <div className="lg:sticky lg:top-28">
          <div className="flex flex-wrap gap-1.5">
            {product.badges
              .filter((b) => b !== 'indirim' && b !== 'tukendi')
              .map((b) => (
                <Badge key={b} kind={b} />
              ))}
            {discount > 0 && <Badge kind="indirim" label={`-%${discount}`} />}
          </div>
          {/* Ürün/seri adları büyük harfe çevrilmez: Türkçe dönüşüm İngilizce adlarda i'yi İ yapar. */}
          {product.series && <p className="mt-5 text-[12px] font-bold tracking-[0.12em] text-muted">{product.series}</p>}
          <h1 className="mt-2 font-display text-[clamp(2.75rem,5vw,4.5rem)] normal-case leading-[0.95]">{product.name}</h1>
          {product.shortDescription && <p className="mt-4 text-base leading-7 text-muted">{product.shortDescription}</p>}

          <div className="mt-6 flex items-end justify-between gap-4 border-y-2 border-fg py-5">
            <Price priceMinor={priceMinor} compareAtMinor={compareAt} size="lg" />
            <p className="text-right text-xs font-semibold uppercase tracking-wider" aria-live="polite">
              {!complete ? (
                <span className="text-muted">Seçim yapın</span>
              ) : variant?.inStock ? (
                <span className="text-success">{lowStock ? `Son ${variant.stockLeft} adet` : 'Stokta'}</span>
              ) : (
                <span className="text-danger">Stokta yok</span>
              )}
              <span className="mt-1 block font-normal normal-case tracking-normal text-subtle">KDV dahil</span>
            </p>
          </div>

          {product.options.map((o) => (
            <fieldset key={o.id} className="mt-6">
              <legend className="mb-2.5 flex w-full justify-between text-[11px] font-bold uppercase tracking-[0.18em]">
                <span>{o.name}</span>
                <span className="text-muted">{o.values.find((v) => v.id === selection[o.id])?.label}</span>
              </legend>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] border-l border-t border-fg">
                {o.values.map((v) => {
                  const state = valueState(o.id, v.id);
                  const active = selection[o.id] === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => choose(o.id, v.id)}
                      disabled={state === 'yok'}
                      aria-pressed={active}
                      className={cn(
                        'min-h-12 border-b border-r border-fg px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-subtle',
                        active ? 'bg-fg text-bg' : 'bg-transparent hover:bg-surface',
                        state === 'stokta-yok' && !active && 'text-subtle line-through',
                      )}
                    >
                      {v.label}
                      {state === 'stokta-yok' && <span className="sr-only"> (stokta yok)</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="mt-6 hidden items-center gap-3 lg:flex">
            <QuantityStepper value={quantity} onChange={setQuantity} max={maxQty} label={product.name} />
            <button type="button" className="btn-primary h-14 flex-1" onClick={addToCart} disabled={!canBuy}>
              <ShoppingBag size={18} aria-hidden="true" /> {canBuy ? 'Sepete ekle' : 'Tükendi'}
            </button>
          </div>

          {hasTaste && (
            <section aria-labelledby="taste-h" className="mt-8">
              <h2 id="taste-h" className="text-[11px] font-bold uppercase tracking-[0.18em] font-sans">
                Tat profili
              </h2>
              <dl className="mt-3 space-y-2.5">
                {TASTE_LABELS.map(([key, label]) => {
                  const value = Math.max(0, Math.min(10, product.taste?.[key] ?? 0));
                  return (
                    <div key={key} className="grid grid-cols-[88px_1fr_24px] items-center gap-3 text-sm">
                      <dt className="text-muted">{label}</dt>
                      <dd className="contents">
                        <span className="flex h-2 gap-0.5" aria-hidden="true">
                          {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} className={cn('flex-1', i < value ? 'bg-accent' : 'bg-surface-3')} />
                          ))}
                        </span>
                        <span className="num text-right">{value}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          )}

          {children}
        </div>
      </div>

      {/* Mobil yapışkan satın alma çubuğu */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-fg bg-bg px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 lg:hidden">
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} max={maxQty} label={product.name} />
          <button type="button" className="btn-primary h-12 flex-1" onClick={addToCart} disabled={!canBuy}>
            {canBuy ? 'Sepete ekle' : 'Tükendi'}
          </button>
        </div>
      </div>
    </div>
  );
}
