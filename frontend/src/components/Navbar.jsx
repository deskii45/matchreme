// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onLoginClick, onFavClick, favCount, onToast }) {
  const { user, logout, isAdmin, isClient } = useAuth();
  const [dark,   setDark]   = useState(localStorage.getItem('darkMode') === 'true');
  const [mobOpen, setMob]   = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  const handleLogout = () => {
    const nama = user?.nama || '';
    logout();
    onToast(`Sampai jumpa, ${nama}! 👋`);
  };

  return (
    <>
      <nav id="topnav">
        <a href="#beranda" className="nav-brand">
          <div className="brand-badge">MS<br/>MRCH</div>
          <div>
            <span className="brand-text"><em>MS</em> Merchandise</span>
            <span className="brand-sub">Produk Custom · Laser &amp; Bubut</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#beranda">Beranda</a></li>
          <li className="drop">
            <a href="#katalog">Katalog Produk</a>
            <div className="dropdown">
              <a href="#katalog">Souvenir</a>
              <a href="#katalog">Ornamen</a>
              <a href="#katalog">Otomotif</a>
            </div>
          </li>
          <li><a href="#tentang">Tentang Kami</a></li>
          <li><a href="#hubungi">Hubungi Kami</a></li>
        </ul>

        <div className="nav-user-area">
          {!user ? (
            <button className="nav-login-btn" onClick={onLoginClick}>🔐 Login</button>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <span className={`nav-user-badge ${user.role}`}>
                  {user.role === 'admin' ? 'Admin' : 'Klien'}
                </span>
                <span className="nav-user-name">{user.nama}</span>
              </div>
              {isClient() && (
                <button className="nav-fav-btn" onClick={onFavClick}>
                  ❤ <span>{favCount}</span>
                </button>
              )}
              <button className="nav-logout-btn" onClick={handleLogout}>Keluar</button>
            </div>
          )}
        </div>

        <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer" className="nav-cta">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <button className="dark-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
          {dark ? '☀️' : '🌙'}
        </button>
        <button className="hamburger" onClick={() => setMob(!mobOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`mob-menu${mobOpen ? ' open' : ''}`} id="mobm">
        <a href="#beranda"  onClick={() => setMob(false)}>Beranda</a>
        <a href="#katalog"  onClick={() => setMob(false)}>Katalog Produk</a>
        <a href="#tentang"  onClick={() => setMob(false)}>Tentang Kami</a>
        <a href="#hubungi"  onClick={() => setMob(false)}>Hubungi Kami</a>
        <a href="https://wa.me/6281313811372" target="_blank" rel="noreferrer" className="m-cta">
          WhatsApp Kami
        </a>
      </div>
    </>
  );
}
