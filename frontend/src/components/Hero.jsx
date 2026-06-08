// src/components/Hero.jsx
import { useEffect, useRef } from 'react';

export default function Hero() {
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('[data-target]').forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          const step = target / 50;
          let current = 0;
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            counter.textContent = Math.floor(current) + (target === 100 ? '' : '+');
            if (current >= target) clearInterval(interval);
          }, 25);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" id="beranda">
      <div className="hero-bg"></div>
      <div className="hero-lines"></div>
      <div className="hero-accent"></div>
      <div className="hero-inner">
        <div className="hero-eyebrow">Produk Custom Laser &amp; Bubut · Bandung</div>
        <h1>
          MS<br/>
          <span className="accent">MERCHAN</span><br/>
          <span className="outline">DISE</span>
        </h1>
        <div className="hero-tagline">Souvenir · Ornamen · Otomotif</div>
        <p>Kami mengerjakan berbagai produk custom berbahan stainless, acrylic, dan logam — dari souvenir unik, ornamen rumah estetik, hingga aksesori otomotif custom. Konsultasi gratis!</p>
        <div className="hero-btns">
          <a href="#katalog" className="btn-main">Lihat Katalog Produk →</a>
          <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer" className="btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Tanya Harga
          </a>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <div><div className="hstat-num" data-target="3">0</div><div className="hstat-label">Kategori Produk</div></div>
          <div><div className="hstat-num" data-target="13">0</div><div className="hstat-label">Varian Item</div></div>
          <div><div className="hstat-num" data-target="100">0</div><div className="hstat-label">% Custom</div></div>
        </div>
      </div>
    </section>
  );
}
