import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { Eye, Minus, Plus } from 'lucide-react';
import { getCategoryById, getCategoryTrail, getProductBySlug, getProductForPreview, getRelated } from '@/storefront/catalog';
import { stripRichText } from '@/lib/rich-text';
import { fromMinor } from '@/lib/money';
import { site } from '@/lib/site';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { ProductBuyBox } from '@/components/product/ProductBuyBox';
import { ProductRail } from '@/components/product/ProductRail';
import { RichText } from '@/components/product/RichText';

type Params = Promise<{ slug: string }>;

async function loadProduct(slug: string) {
  return (await draftMode()).isEnabled ? getProductForPreview(slug) : getProductBySlug(slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return { title: 'Ürün bulunamadı' };
  const description = product.seo.description || product.shortDescription || stripRichText(product.description).slice(0, 160);
  return {
    title: product.seo.title || product.name,
    description,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: { title: product.name, description, images: product.images[0] ? [product.images[0].src] : [] },
  };
}

/** Artı/eksi işaretli açılır bölüm. */
function Section({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[12px] font-bold uppercase tracking-[0.18em]">
        {title}
        <Plus size={18} aria-hidden="true" className="group-open:hidden" />
        <Minus size={18} aria-hidden="true" className="hidden group-open:block" />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const preview = (await draftMode()).isEnabled;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const node = product.categoryIds[0] ? await getCategoryById(product.categoryIds[0]) : undefined;
  const trail = node ? await getCategoryTrail(node) : [];
  const crumbs: Crumb[] = [...trail.map((c) => ({ label: c.name, href: `/kategori/${c.slug}` })), { label: product.name }];
  const related = await getRelated(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.src),
    description: product.shortDescription || stripRichText(product.description).slice(0, 300),
    sku: product.variants[0]?.sku,
    brand: product.series ? { '@type': 'Brand', name: product.series } : undefined,
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      sku: v.sku,
      price: fromMinor(v.priceMinor).toFixed(2),
      priceCurrency: 'TRY',
      availability: v.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${site.domain}/urun/${product.slug}`,
    })),
  };

  return (
    <>
      {preview && (
        <div className="bg-hazard text-white">
          <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-2">
              <Eye size={15} aria-hidden="true" /> Önizleme — panelden kaydedilen güncel hal (taslak dahil)
            </span>
            <a href={`/api/onizleme?cikis=1&slug=${encodeURIComponent(product.slug)}`} className="underline underline-offset-4">
              Önizlemeden çık
            </a>
          </div>
        </div>
      )}
      <div className="container-page pt-6">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6">
          <ProductBuyBox product={product}>
            <div className="mt-8 border-t-2 border-fg">
              {product.description && (
                <Section title="Açıklama" open>
                  <RichText text={product.description} />
                </Section>
              )}
              {product.flavorNotes.length > 0 && (
                <Section title="Aroma notaları">
                  <ul className="flex flex-wrap gap-2">
                    {product.flavorNotes.map((n) => (
                      <li key={n.label} className="chip">
                        {n.label}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {product.faq.length > 0 && (
                <Section title="Sık sorulanlar">
                  <dl className="space-y-4">
                    {product.faq.map((f) => (
                      <div key={f.question}>
                        <dt className="font-semibold">{f.question}</dt>
                        <dd className="mt-1 text-sm leading-6 text-muted">{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </Section>
              )}
              <Section title="Kargo ve iade">
                <div className="prose-dark">
                  <p>Siparişin 1–3 iş günü içinde kargoya verilir; takip numarası e-posta ile gönderilir.</p>
                  <p>Ambalajı açılmamış ürünlerde yasal cayma süresi içinde iade talebi oluşturabilirsin. Hijyen nedeniyle açılmış likit ve kartuşlar iade alınamaz.</p>
                </div>
              </Section>
            </div>
          </ProductBuyBox>
        </div>
      </div>

      <ProductRail eyebrow="Bunlara da bak" title="Benzer ürünler" products={related} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
