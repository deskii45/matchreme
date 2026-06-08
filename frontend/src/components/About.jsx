// src/components/About.jsx
export default function About() {
  const WA_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  return (
    <section className="sec" id="tentang">
      <div className="about-wrap">
        <div className="about-visual">
          <div className="about-card about-card-main">
            <div className="big-num">MS</div>
            <div className="big-num-sub">Merchandise Custom berbahan logam, stainless &amp; acrylic</div>
          </div>
          <div className="about-cards-row">
            <div className="mini-card"><div class="mini-num">3</div><div class="mini-label">Kategori Produk</div></div>
            <div className="mini-card"><div class="mini-num">13+</div><div class="mini-label">Varian Item</div></div>
            <div className="mini-card"><div class="mini-num">100%</div><div class="mini-label">Custom Order</div></div>
            <div className="mini-card"><div class="mini-num">IDN</div><div class="mini-label">Pengiriman Nasional</div></div>
          </div>
        </div>
        <div>
          <div className="sec-eye">Tentang Kami</div>
          <div className="sec-h">MS Merchandise</div>
          <p className="about-desc">
            <strong>MS Merchandise</strong> adalah usaha yang bergerak di bidang pembuatan produk custom berbahan logam, stainless steel, dan acrylic menggunakan teknologi laser cutting dan mesin bubut. Kami hadir untuk memenuhi kebutuhan souvenir unik, dekorasi rumah estetik, hingga aksesori kendaraan bermotor yang dibuat sesuai keinginan pelanggan.
          </p>
          <p className="about-desc">
            Harga kami <strong>tidak dipatok tetap</strong> — karena setiap produk dikerjakan berdasarkan desain, ukuran, dan bahan yang dipilih. Hubungi kami untuk mendapatkan penawaran terbaik!
          </p>
          <div className="feat-list">
            <div className="feat">
              <div className="feat-dot">✂️</div>
              <div>
                <div className="feat-t">Laser Cutting &amp; Bubut</div>
                <div className="feat-d">Dikerjakan dengan teknologi laser dan mesin bubut presisi tinggi.</div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-dot">🎨</div>
              <div>
                <div className="feat-t">100% Custom Sesuai Desain</div>
                <div className="feat-d">Anda bisa request bentuk, ukuran, dan tulisan sesuai kebutuhan.</div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-dot">🚚</div>
              <div>
                <div className="feat-t">Pengiriman ke Seluruh Indonesia</div>
                <div className="feat-d">Melayani pengiriman aman ke semua wilayah Indonesia.</div>
              </div>
            </div>
            <div className="feat">
              <div className="feat-dot">
                {WA_SVG}
              </div>
              <div>
                <div className="feat-t">Konsultasi &amp; Penawaran Gratis</div>
                <div className="feat-d">Ceritakan kebutuhan Anda, kami bantu wujudkan dengan harga terbaik.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
