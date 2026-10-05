import type { CardBadge } from '@/lib/product';
import { cn } from '@/lib/utils';

const STYLES: Record<CardBadge, { label: string; cls: string }> = {
  yeni: { label: 'Yeni', cls: 'bg-fg text-bg' },
  indirim: { label: 'İndirim', cls: 'bg-hazard text-white' },
  'cok-satan': { label: 'Çok satan', cls: 'bg-accent text-accent-ink' },
  tukendi: { label: 'Tükendi', cls: 'bg-surface text-muted ring-1 ring-line-strong' },
};

/** Etiket — kare köşeli, küçük büyük harf. */
export function Badge({ kind, label, className }: { kind: CardBadge; label?: string; className?: string }) {
  const s = STYLES[kind];
  return (
    <span className={cn('inline-flex h-6 items-center rounded-[3px] px-2 text-[10px] font-bold uppercase tracking-[0.12em]', s.cls, className)}>
      {label ?? s.label}
    </span>
  );
}
