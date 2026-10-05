const ITEMS = [
  { title: 'Seçerek satarız', text: 'Raftaki her ürünü tadıp listeye alıyoruz; sayıdan çok isabet.' },
  { title: 'Gizli paket', text: 'Dışarıdan içeriği belli olmayan, sızdırmaz ve darbe emici paketleme.' },
  { title: 'Hızlı kargo', text: 'Siparişler 1–3 iş günü içinde kargoya verilir, takip numarası e-postayla gelir.' },
  { title: 'Güvenli ödeme', text: '3D Secure kart, havale/EFT ve kapıda ödeme. Kart bilgin bizde tutulmaz.' },
];

/** Numaralı ilkeler tablosu — çizgili, kartsız. */
export function Principles() {
  return (
    <section aria-labelledby="pr-title" className="container-page py-14 sm:py-20">
      <h2 id="pr-title" className="sr-only">
        Neden KanziVape
      </h2>
      <ol className="grid border-t-2 border-fg sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <li key={it.title} className="border-b border-line py-6 sm:px-6 lg:border-b-0 lg:border-l lg:first:border-l-0 lg:first:pl-0">
            <span className="num text-5xl text-hazard">{String(i + 1).padStart(2, '0')}</span>
            <p className="mt-4 font-display text-2xl uppercase leading-none">{it.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{it.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
