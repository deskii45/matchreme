// src/components/Contact.jsx
import { useState } from 'react';

const WA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const INSTA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const EMAIL_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const SHOPEE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 7h-1.5c0-2.76-2.24-5-5-5S7 4.24 7 7H5.5C4.12 7 3 8.12 3 9.5v9C3 19.88 4.12 21 5.5 21h13c1.38 0 2.5-1.12 2.5-2.5v-9C21 8.12 19.88 7 19 7zm-6.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v2zM9 7c0-1.93 1.57-3.5 3.5-3.5S16 5.07 16 7H9z"/>
  </svg>
);

const TIKTOK_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

export default function Contact({ onToast }) {
  const [nama, setNama]   = useState('');
  const [wa, setWa]       = useState('');
  const [prod, setProd]   = useState('');
  const [pesan, setPesan] = useState('');

  const handleSend = () => {
    if (!nama.trim() || !wa.trim() || !pesan.trim()) {
      onToast('Mohon isi Nama, No. WhatsApp, dan Pesan.', 'err');
      return;
    }
    onToast('Pesan terkirim! Kami akan menghubungi Anda segera.', 'success');
    setNama('');
    setWa('');
    setProd('');
    setPesan('');
  };

  return (
    <section className="sec sec-alt" id="hubungi">
      <div className="sec-eye">Hubungi Kami</div>
      <div className="sec-h">Tanya Harga &amp; Pesan</div>
      <p className="sec-sub">Ceritakan kebutuhan Anda — desain, ukuran, jumlah — dan kami akan berikan penawaran terbaik.</p>
      <div className="contact-wrap">
        <div className="contact-info-block">
          <h3>Informasi Kontak</h3>
          <div className="c-item">
            <div className="c-ico">📍</div>
            <div>
              <div className="c-t">Alamat</div>
              <div className="c-v">Bandung, Jawa Barat, Indonesia</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">{WA_SVG}</div>
            <div>
              <div className="c-t">WhatsApp</div>
              <div className="c-v">+62 813-1381-1372</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">{INSTA_SVG}</div>
            <div>
              <div className="c-t">Instagram</div>
              <div className="c-v">
                <a href="https://www.instagram.com/msforce.machine/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  @msforce.machine
                </a>
              </div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">{EMAIL_SVG}</div>
            <div>
              <div className="c-t">Email</div>
              <div className="c-v">
                <a href="mailto:ms.merchandise01@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  ms.merchandise01@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">{SHOPEE_SVG}</div>
            <div>
              <div className="c-t">Shopee</div>
              <div className="c-v">
                <a href="https://shopee.co.id/ms.merchandise" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  shopee.co.id/ms.merchandise
                </a>
              </div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">{TIKTOK_SVG}</div>
            <div>
              <div className="c-t">TikTok</div>
              <div className="c-v">
                <a href="https://www.tiktok.com/@ms.merchandise01?_r=1&_t=ZS-96ZiIpG1r4T" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  @ms.merchandise01
                </a>
              </div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">⏰</div>
            <div>
              <div className="c-t">Jam Operasional</div>
              <div className="c-v">Senin – Sabtu · 08.00 – 17.00 WIB</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-ico">💡</div>
            <div>
              <div className="c-t">Info Harga</div>
              <div className="c-v">Harga menyesuaikan desain, ukuran, dan bahan. Hubungi kami untuk penawaran.</div>
            </div>
          </div>
          <div className="socials">
            <a href="https://www.instagram.com/msforce.machine/" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">{INSTA_SVG}</a>
            <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer" className="social-btn" title="WhatsApp">{WA_SVG}</a>
            <a href="mailto:ms.merchandise01@gmail.com" className="social-btn" title="Email">{EMAIL_SVG}</a>
            <a href="https://shopee.co.id/ms.merchandise" target="_blank" rel="noreferrer" className="social-btn" title="Shopee">{SHOPEE_SVG}</a>
            <a href="https://www.tiktok.com/@ms.merchandise01?_r=1&_t=ZS-96ZiIpG1r4T" target="_blank" rel="noreferrer" className="social-btn" title="TikTok">{TIKTOK_SVG}</a>
          </div>
        </div>
        <div className="cf">
          <div className="cf-row">
            <div className="fg">
              <label htmlFor="f-nama">Nama Lengkap</label>
              <input type="text" id="f-nama" placeholder="Nama Anda" value={nama} onChange={e => setNama(e.target.value)} />
            </div>
            <div className="fg">
              <label htmlFor="f-wa">No. WhatsApp</label>
              <input type="tel" id="f-wa" placeholder="+62 ..." value={wa} onChange={e => setWa(e.target.value)} />
            </div>
          </div>
          <div className="fg">
            <label htmlFor="f-prod">Kategori Produk</label>
            <select id="f-prod" value={prod} onChange={e => setProd(e.target.value)}>
              <option value="">Pilih kategori...</option>
              <option value="Souvenir – Keychain">Souvenir – Keychain</option>
              <option value="Souvenir – Nomor Rumah">Souvenir – Nomor Rumah</option>
              <option value="Souvenir – Jam Besi">Souvenir – Jam Besi</option>
              <option value="Souvenir – Plakat">Souvenir – Plakat</option>
              <option value="Souvenir – Custom Lainnya">Souvenir – Custom Lainnya</option>
              <option value="Ornamen – Pagar Rumah">Ornamen – Pagar Rumah</option>
              <option value="Ornamen – Hiasan Dinding">Ornamen – Hiasan Dinding</option>
              <option value="Ornamen – Partisi Ruangan">Ornamen – Partisi Ruangan</option>
              <option value="Ornamen – Custom Lainnya">Ornamen – Custom Lainnya</option>
              <option value="Otomotif – Pijakan Motor">Otomotif – Pijakan Motor</option>
              <option value="Otomotif – Tameng Knalpot">Otomotif – Tameng Knalpot</option>
              <option value="Otomotif – Custom Part Lainnya">Otomotif – Custom Part Lainnya</option>
            </select>
          </div>
          <div className="fg">
            <label htmlFor="f-msg">Keterangan Desain / Pesan</label>
            <textarea id="f-msg" placeholder="Ceritakan desain, ukuran, jumlah, dan kebutuhan Anda..." value={pesan} onChange={e => setPesan(e.target.value)}></textarea>
          </div>
          <div className="form-btns">
            <button className="btn-main" id="sendBtn" onClick={handleSend}>Kirim Pesan →</button>
            <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer" className="wabtn">{WA_SVG} WhatsApp Langsung</a>
          </div>
        </div>
      </div>
    </section>
  );
}
