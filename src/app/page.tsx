import { Sparkles } from 'lucide-react';
import { getHomeData, getRootCategories, listProducts } from '@/storefront/catalog';
import { Hero } from '@/components/home/Hero';
import { CategoryIndex } from '@/components/home/CategoryIndex';
import { WordBand } from '@/components/home/WordBand';
import { NewArrivals } from '@/components/home/NewArrivals';
import { SalePanel } from '@/components/home/SalePanel';
import { Principles } from '@/components/home/Principles';
import { ProductRail } from '@/components/product/ProductRail';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function HomePage() {
  const [home, categories, onSale] = await Promise.all([getHomeData(), getRootCategories(), listProducts({ onlySale: true, onlyInStock: true })]);

  return (
    <>
      <Hero spotlight={home.featured[0]} productCount={home.total} />

      {home.total === 0 ? (
        <div className="container-page py-16">
          <EmptyState icon={Sparkles} title="Mağaza hazırlanıyor" description="Ürünlerimiz çok yakında burada. Bültene kaydol, açılıştan ilk sen haberdar ol." />
        </div>
      ) : (
        <>
          <ProductRail eyebrow="Seçtiklerimiz" title="Öne çıkanlar" href="/urunler" products={home.featured} />
          <WordBand words={categories.map((c) => c.name)} />
          <CategoryIndex categories={categories} />
          <SalePanel products={onSale} />
          <NewArrivals products={home.newest} />
          <Principles />
          <ProductRail eyebrow="Favoriler" title="Çok satanlar" href="/urunler?sirala=cok-satan" products={home.bestSellers} />
        </>
      )}
    </>
  );
}
