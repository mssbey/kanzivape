import Link from 'next/link';
import { getStoreInfo } from '@/server/settings';
import { getRootCategories } from '@/storefront/catalog';
import { site } from '@/lib/site';
import { NewsletterForm } from './NewsletterForm';

const HELP = [
  { href: '/siparis-takibi', label: 'Sipariş takibi' },
  { href: '/hesabim', label: 'Hesabım' },
  { href: '/sss', label: 'SSS' },
  { href: '/iletisim', label: 'İletişim' },
];

const LEGAL = [
  { href: '/yasal/mesafeli-satis', label: 'Mesafeli satış sözleşmesi' },
  { href: '/yasal/on-bilgilendirme', label: 'Ön bilgilendirme formu' },
  { href: '/yasal/kvkk-aydinlatma', label: 'KVKK aydınlatma metni' },
];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-bg/50">{title}</p>
      {children}
    </div>
  );
}

export async function Footer() {
  const [info, categories] = await Promise.all([getStoreInfo(), getRootCategories()]);
  const linkCls = 'text-sm text-bg/80 transition-colors hover:text-hazard';

  return (
    <footer className="mt-24 overflow-hidden bg-fg text-bg">
      <div className="container-page grid gap-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl uppercase leading-none">Bültene katıl</p>
          <p className="mb-6 mt-3 max-w-sm text-sm leading-6 text-bg/70">{site.description}</p>
          <NewsletterForm />
        </div>

        <Column title="Mağaza">
          <ul className="space-y-2.5">
            <li>
              <Link href="/urunler" className={linkCls}>
                Tüm ürünler
              </Link>
            </li>
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/kategori/${c.slug}`} className={linkCls}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/kampanyalar" className={linkCls}>
                Kampanyalar
              </Link>
            </li>
          </ul>
        </Column>

        <Column title="Yardım">
          <ul className="space-y-2.5">
            {HELP.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-2.5">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-bg/60 hover:text-hazard">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="İletişim">
          <ul className="space-y-2.5 text-sm text-bg/80">
            {info.phone && (
              <li>
                <a href={`tel:${info.phone.replace(/\s/g, '')}`} className={linkCls}>
                  {info.phone}
                </a>
              </li>
            )}
            {info.email && (
              <li>
                <a href={`mailto:${info.email}`} className={`${linkCls} break-all`}>
                  {info.email}
                </a>
              </li>
            )}
            {(info.address || info.city) && <li>{[info.address, info.city].filter(Boolean).join(', ')}</li>}
            {!info.phone && !info.email && <li className="text-bg/60">Bilgiler yakında.</li>}
          </ul>
          <p className="mt-8 text-xs leading-5 text-bg/60">Kart bilgilerin bizde saklanmaz; ödemeler 3D Secure ile banka altyapısında alınır.</p>
        </Column>
      </div>

      <div className="container-page mt-14 flex flex-col gap-2 border-t border-bg/15 py-5 text-xs text-bg/55 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {info.tradeName || site.name}
        </p>
        <p>Ürünlerimiz {site.minimumAge} yaş altındaki kişilere satılmaz. Nikotin bağımlılık yapan bir maddedir.</p>
      </div>

      {/* Dev kelime markası — dekoratif. */}
      <p aria-hidden="true" className="select-none whitespace-nowrap px-2 text-center font-display text-[24vw] leading-[0.78] text-bg/[0.07]">
        KANZI
      </p>
    </footer>
  );
}
