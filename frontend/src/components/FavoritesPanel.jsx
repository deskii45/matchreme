// src/components/FavoritesPanel.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

export default function FavoritesPanel({ open, onClose, onCountUpdate, onToast }) {
  const { user } = useAuth();
  const [favs,    setFavs]    = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) loadFavs();
  }, [open, user]);

  const loadFavs = async () => {
    setLoading(true);
    try {
      const res = await api.getFavorites(user.id);
      setFavs(res.ok ? res.data : []);
    } catch { setFavs([]); }
    finally { setLoading(false); }
  };

  const handleRemove = async (pid) => {
    try {
      await api.removeFavorite(user.id, pid);
      const updated = favs.filter(p => p.id !== pid);
      setFavs(updated);
      onCountUpdate(updated.length);
    } catch {
      onToast('Gagal menghapus favorit.', 'err');
    }
  };

  return (
    <>
      {open && <div className="modal-overlay visible" onClick={onClose} />}
      <div className={`fav-panel${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <div className="fav-header">
          <h2>❤ Favorit Saya</h2>
          <button className="modal-close static" onClick={onClose}>&times;</button>
        </div>
        <div className="fav-body">
          {loading ? (
            <div className="fav-empty"><span className="fav-empty-icon">⏳</span><p>Memuat...</p></div>
          ) : favs.length === 0 ? (
            <div className="fav-empty">
              <span className="fav-empty-icon">🤍</span>
              <p>Belum ada produk favorit.<br/>Tekan tombol ❤ di kartu produk untuk menambahkan.</p>
            </div>
          ) : favs.map(prod => {
            const catLabel = prod.cat.charAt(0).toUpperCase() + prod.cat.slice(1);
            return (
              <div className="fav-item" key={prod.id}>
                <img className="fav-item-img" src={'/' + prod.img} alt={prod.alt} onError={e => { e.target.style.background = '#eee'; }} />
                <div className="fav-item-info">
                  <div className="fav-item-cat">{catLabel}</div>
                  <div className="fav-item-name">{prod.name}</div>
                </div>
                <button className="fav-item-remove" title="Hapus dari favorit" onClick={() => handleRemove(prod.id)}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
