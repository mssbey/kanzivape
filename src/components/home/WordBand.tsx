/** Çivit zeminde kayan büyük kelimeler — dekoratif ritim bandı. */
export function WordBand({ words }: { words: string[] }) {
  const list = words.length ? words : ['Likit', 'Pod', 'Salt', 'Aksesuar'];
  const row = [...list, ...list, ...list];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y-2 border-fg bg-accent py-4 text-accent-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6 font-display text-4xl uppercase leading-none sm:text-6xl">{w}</span>
                <span className="h-3 w-3 rotate-45 bg-hazard" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
