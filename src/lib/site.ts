// KanziVape site yapılandırması.
//
// Ortak sunucu kodu (Mixle'dan senkronlanır) bu dosyadan yalnız `site.name`,
// `site.domain` ve `currency` okur. İletişim/unvan bilgileri panelden (Mixle →
// mağaza: KanziVape → Ayarlar → Mağaza) gelir — `getStoreInfo()`.

export const site = {
  name: 'KanziVape',
  shortName: 'Kanzi',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://kanzivape.com',
  description: 'KanziVape — seçkin likitler, pod sistemler ve aksesuarlar. Sade seçki, net aroma, hızlı teslimat.',
  tagline: 'Sade seçki. Net aroma.',
  locale: 'tr_TR',
  /** Yaş sınırı — vitrin ilk ziyarette doğrulama ister. */
  minimumAge: 18,
  commerce: {
    estimatedDelivery: '1–3 iş günü içinde kargoda',
  },
  announcements: [
    'Satışlar yalnızca 18 yaş ve üzeri kullanıcılara yapılır',
    'Kredi kartına taksit · havale/EFT · kapıda ödeme',
    'Her sipariş sızdırmaz ve gizli paketle gönderilir',
  ],
} as const;

/**
 * Ürün görseli adresi. Panelden yüklenenler Vercel Blob'da (mutlak URL);
 * görece yollar (`/images/…`, `/api/medya/…`) Mixle dağıtımında durur.
 */
export function mediaUrl(src: string | null | undefined): string {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) return src;
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://mixle.net').replace(/\/$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
}

/** TL biçimlendirici — ortak kod (`lib/money`, `lib/admin/format`) bunu bekler. */
export const currency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
