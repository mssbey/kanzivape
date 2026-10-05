import { cn } from '@/lib/utils';

/** Hanko (Japon mührü) esinli işaret: vermilyon kare içinde K. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('h-8 w-8', className)}>
      <rect x="1" y="1" width="30" height="30" rx="3" className="fill-hazard" />
      <rect x="3.5" y="3.5" width="25" height="25" rx="1.5" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.55" />
      <path d="M10 8h3.6v6.6L19.4 8h4.3l-6.4 7.2L24 24h-4.4l-4.8-6.4-1.2 1.3V24H10z" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      {!compact && (
        <span className="flex items-baseline gap-1 leading-none">
          {/* Marka adı doğrudan büyük harfle yazılır: `uppercase` Türkçe sayfada i'yi İ yapar. */}
          <span className="font-display text-[26px] tracking-[0.04em] text-fg">KANZI</span>
          <span className="text-[10px] font-bold tracking-[0.3em] text-muted">VAPE</span>
        </span>
      )}
    </span>
  );
}
