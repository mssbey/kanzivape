import { formatMinor } from '@/lib/money';
import { cn } from '@/lib/utils';

/** Fiyat — rakamlar başlık yazısında (Anton), indirimsiz fiyat üstü çizili. */
export function Price({
  priceMinor,
  compareAtMinor,
  maxPriceMinor,
  size = 'md',
  className,
}: {
  priceMinor: number;
  compareAtMinor?: number | null;
  /** Varyant fiyatları farklıysa "…'den başlayan" notu gösterilir. */
  maxPriceMinor?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const main = { sm: 'text-lg', md: 'text-xl', lg: 'text-5xl' }[size];
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span className={cn('num leading-none', main, compareAtMinor ? 'text-hazard' : 'text-fg')}>{formatMinor(priceMinor)}</span>
      {maxPriceMinor ? <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">’den başlayan</span> : null}
      {compareAtMinor ? (
        <span className={cn('text-subtle line-through', size === 'lg' ? 'text-lg' : 'text-xs')}>
          <span className="sr-only">İndirimsiz fiyat: </span>
          {formatMinor(compareAtMinor)}
        </span>
      ) : null}
    </span>
  );
}
