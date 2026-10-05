'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useCart, cartCount } from '@/store/cart';
import { useEscape, useLockBody, useMounted } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { SearchOverlay } from './SearchOverlay';

export interface NavLink {
  label: string;
  href: string;
  emphasis?: boolean;
}

export function Header({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const count = useCart((s) => cartCount(s.lines));
  const openCart = useCart((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useLockBody(menuOpen);
  useEscape(menuOpen, closeMenu);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0]));
  const textLink = 'inline-flex min-h-11 items-center px-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors';

  return (
    <>
      <header className={cn('sticky top-0 z-40 border-b bg-bg/95 backdrop-blur transition-colors', scrolled ? 'border-fg' : 'border-line')}>
        <div className="container-page grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Sol: masaüstünde menü, mobilde menü düğmesi */}
          <div className="flex items-center">
            <button
              type="button"
              className="btn-ghost -ml-3 w-11 px-0 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              aria-controls="kv-menu"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
            <nav aria-label="Ana menü" className="hidden lg:block">
              <ul className="flex items-center gap-3">
                {links.slice(0, 5).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? 'page' : undefined}
                      className={cn(
                        textLink,
                        'relative after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100',
                        isActive(l.href) ? 'text-fg after:scale-x-100' : 'text-muted hover:text-fg',
                        l.emphasis && 'text-hazard hover:text-hazard',
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href="/" aria-label="KanziVape ana sayfa">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <button type="button" className={cn(textLink, 'text-muted hover:text-fg')} onClick={() => setSearchOpen(true)}>
              Ara
            </button>
            <Link href="/hesabim" className={cn(textLink, 'hidden text-muted hover:text-fg sm:inline-flex')}>
              Hesap
            </Link>
            <button type="button" onClick={openCart} className={cn(textLink, 'gap-1.5 text-fg')} aria-label={`Sepet, ${mounted ? count : 0} ürün`}>
              <span aria-hidden="true">Sepet</span>
              <span aria-hidden="true" className="num grid h-6 min-w-6 place-items-center rounded-full bg-fg px-1.5 text-[13px] text-bg">
                {mounted ? count : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobil: tam ekran, büyük harfli menü */}
      <div
        id="kv-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        aria-hidden={!menuOpen}
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-bg transition-[opacity,visibility] duration-300 lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between border-b border-fg">
          <Logo />
          <button type="button" className="btn-ghost -mr-3 w-11 px-0" onClick={closeMenu} aria-label="Menüyü kapat">
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobil menü" className="container-page flex-1 overflow-y-auto py-6">
          <ol className="divide-y divide-line">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} className={cn('flex items-center gap-4 py-4', l.emphasis ? 'text-hazard' : 'text-fg')}>
                  <span className="num w-8 text-sm text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-4xl uppercase leading-none">{l.label}</span>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="container-page grid grid-cols-2 gap-2 border-t border-line py-5">
          <Link href="/hesabim" className="btn-secondary">
            Hesabım
          </Link>
          <Link href="/siparis-takibi" className="btn-secondary">
            Sipariş takibi
          </Link>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
