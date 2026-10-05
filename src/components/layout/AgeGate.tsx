'use client';

// 18+ yaş kapısı — ilk ziyarette tam ekran sorulur; onay tarayıcıda saklanır.
// Yasal metinler ve ödeme dönüş sayfaları kapı arkasında kalmaz.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/ui/Logo';
import { site } from '@/lib/site';

const KEY = 'kanzi-yas-onay';
const OPEN_PATHS = ['/yasal', '/odeme/dogrulama', '/siparis/tamamlandi'];

function readConfirmed(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function AgeGate() {
  const pathname = usePathname();
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    if (OPEN_PATHS.some((p) => pathname.startsWith(p))) return;
    setNeeded(!readConfirmed());
  }, [pathname]);

  useEffect(() => {
    if (!needed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [needed]);

  if (!needed) return null;

  const confirm = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // Depolama kapalıysa yalnız bu oturum için kapanır.
    }
    setNeeded(false);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-bg p-5" role="dialog" aria-modal="true" aria-labelledby="age-title" aria-describedby="age-desc">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <span
        aria-hidden="true"
        className="vertical-text pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 font-display text-[11vh] uppercase leading-none text-fg/[0.06] md:block"
      >
        Yalnızca yetişkinler
      </span>
      <div className="relative w-full max-w-lg animate-fade-up">
        <LogoMark className="h-14 w-14" />
        <p className="eyebrow mt-8">Yaş doğrulaması</p>
        <h2 id="age-title" className="mt-3 font-display text-[clamp(3.25rem,10vw,5.5rem)] uppercase leading-[0.9]">
          {site.minimumAge} yaşından
          <br />
          büyük müsün?
        </h2>
        <p id="age-desc" className="mt-5 max-w-md text-base leading-7 text-muted">
          Bu sitedeki ürünler nikotin içerebilir ve yalnızca {site.minimumAge} yaş ve üzeri yetişkinlere yöneliktir. Nikotin bağımlılık yapan bir maddedir.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn-primary h-14 flex-1" onClick={confirm} autoFocus>
            Evet, {site.minimumAge}+ yaşındayım
          </button>
          <a href="https://www.google.com" className="btn-secondary h-14 flex-1">
            Hayır, çıkış
          </a>
        </div>
      </div>
    </div>
  );
}
