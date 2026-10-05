import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Büyük numaralı sayfalama; ilk, son ve geçerlinin komşuları gösterilir. */
export function Pagination({ page, pageCount, basePath, params }: { page: number; pageCount: number; basePath: string; params: Record<string, string | undefined> }) {
  if (pageCount <= 1) return null;
  const href = (n: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== 'sayfa') qs.set(k, v);
    if (n > 1) qs.set('sayfa', String(n));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const edge = 'inline-flex min-h-12 items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em]';

  return (
    <nav aria-label="Sayfalar" className="mt-16 flex items-center justify-between border-t-2 border-fg pt-6">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(edge, 'hover:text-accent')}>
          <ArrowLeft size={18} aria-hidden="true" /> Önceki
        </Link>
      ) : (
        <span className={cn(edge, 'text-subtle')} aria-hidden="true">
          <ArrowLeft size={18} /> Önceki
        </span>
      )}
      <ol className="flex items-center gap-1">
        {pages.map((n, i) => (
          <li key={n} className="flex items-center gap-1">
            {i > 0 && n - pages[i - 1] > 1 && <span className="px-1 text-subtle">…</span>}
            <Link
              href={href(n)}
              aria-current={n === page ? 'page' : undefined}
              className={cn('num grid h-12 min-w-12 place-items-center px-2 text-3xl transition-colors', n === page ? 'text-hazard' : 'text-subtle hover:text-fg')}
            >
              {String(n).padStart(2, '0')}
            </Link>
          </li>
        ))}
      </ol>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={cn(edge, 'hover:text-accent')}>
          Sonraki <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(edge, 'text-subtle')} aria-hidden="true">
          Sonraki <ArrowRight size={18} />
        </span>
      )}
    </nav>
  );
}
