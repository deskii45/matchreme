// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo"><em>MS</em> Merchandise</div>
          <p>Produk custom berbahan logam, stainless &amp; acrylic — souvenir, ornamen, dan aksesori otomotif sesuai desain Anda.</p>
        </div>
        <div className="footer-nav">
          <h4>Navigasi</h4>
          <a href="#beranda">Beranda</a>
          <a href="#katalog">Katalog Produk</a>
          <a href="#tentang">Tentang Kami</a>
          <a href="#hubungi">Hubungi Kami</a>
        </div>
        <div className="footer-nav">
          <h4>Kategori Produk</h4>
          <a href="#katalog">Souvenir</a>
          <a href="#katalog">Ornamen</a>
          <a href="#katalog">Otomotif</a>
        </div>
        <div className="footer-nav">
          <h4>Kontak</h4>
          <a href="https://www.instagram.com/msforce.machine/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 MS Merchandise. All rights reserved.</p>
        <p>Bandung, Jawa Barat, Indonesia</p>
      </div>
    </footer>
  );
}
