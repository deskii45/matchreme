// src/components/Catalog.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import ProductModal from './ProductModal';

const WA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Catalog({ onToast, onFavUpdate }) {
  const { user, isAdmin, isClient } = useAuth();
  const [catalog,    setCatalog]    = useState([]);
  const [favIds,     setFavIds]     = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editProd,   setEditProd]   = useState(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCatalog();
      setCatalog(res.ok ? res.data : []);
    } catch { setCatalog([]); }
    finally { setLoading(false); }
  }, []);

  const loadFavIds = useCallback(async () => {
    if (!user || user.role !== 'client') { setFavIds([]); return; }
    try {
      const res = await api.getFavIds(user.id);
      setFavIds(res.ok ? res.data : []);
    } catch { setFavIds([]); }
  }, [user]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);
  useEffect(() => { loadFavIds(); }, [loadFavIds]);

  const handleToggleFav = async (e, pid) => {
    e.stopPropagation();
    if (!user) { onToast('Login dulu untuk menambahkan favorit!', 'err'); return; }
    try {
      const res = await api.toggleFavorite({ user_id: user.id, product_id: pid });
      if (!res.ok) { onToast(res.msg || 'Gagal.', 'err'); return; }
      const added = res.added;
      setFavIds(prev => added ? [...prev, pid] : prev.filter(id => id !== pid));
      if (onFavUpdate) {
        const newRes = await api.getFavIds(user.id);
        onFavUpdate(newRes.ok ? newRes.data.length : 0);
      }
      onToast(added ? 'Ditambahkan ke Favorit ❤' : 'Dihapus dari Favorit', added ? 'fav' : '');
    } catch { onToast('Gagal konek ke server.', 'err'); }
  };

  const handleDelete = async (e, pid) => {
    e.stopPropagation();
    if (!confirm('Hapus produk ini dari katalog?')) return;
    try {
      const res = await api.deleteProduct(pid);
      if (res.ok) { onToast('Produk berhasil dihapus.', 'err'); loadCatalog(); }
      else onToast(res.msg || 'Gagal menghapus.', 'err');
    } catch { onToast('Gagal konek ke server.', 'err'); }
  };

  const handleEdit = async (e, pid) => {
    e.stopPropagation();
    try {
      const res = await api.getProduct(pid);
      if (res.ok) { setEditProd(res.data); setModalOpen(true); }
    } catch { onToast('Gagal memuat data produk.', 'err'); }
  };

  const filtered = filter === 'all' ? catalog : catalog.filter(p => p.cat === filter);

  return (
    <section className="sec sec-alt" id="katalog">
      <div className="products-header">
        <div>
          <div className="sec-eye">Katalog Produk</div>
          <div className="sec-h">Produk Kami</div>
          <p className="sec-sub">Semua produk dikerjakan custom sesuai permintaan. Hubungi kami untuk penawaran.</p>
        </div>
        {isAdmin() && (
          <button className="btn-admin-add" onClick={() => { setEditProd(null); setModalOpen(true); }}>
            + Tambah Produk
          </button>
        )}
      </div>

      <div className="cat-tabs">
        {['all','souvenir','ornamen','otomotif'].map(c => (
          <button key={c} className={`cat-tab${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>
            {c === 'all' ? 'Semua' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="prod-grid">
        {loading ? (
          <div className="loading-grid">⏳ Memuat katalog...</div>
        ) : filtered.length === 0 ? (
          <div className="loading-grid">
            <div style={{fontSize:'48px',marginBottom:'16px'}}>📦</div>
            <p>Belum ada produk di kategori ini.</p>
            {isAdmin() && <p style={{marginTop:'8px'}}>Gunakan tombol <strong>+ Tambah Produk</strong>.</p>}
          </div>
        ) : filtered.map(prod => {
          const catLabel = prod.cat.charAt(0).toUpperCase() + prod.cat.slice(1);
          const isFav    = favIds.includes(prod.id);
          return (
            <div className="prod-card" key={prod.id} data-c={prod.cat}>
              <div className="prod-img">
                <img src={'/' + prod.img} alt={prod.alt} loading="lazy"
                  onError={e => { e.target.style.display='none'; }} />
                <span className="cat-badge">{catLabel}</span>
                {isClient() && (
                  <button className={`prod-fav-btn${isFav ? ' active' : ''}`}
                    title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                    onClick={e => handleToggleFav(e, prod.id)}>
                    {isFav ? '❤️' : '🤍'}
                  </button>
                )}
                {isAdmin() && (
                  <div className="prod-admin-btns">
                    <button className="prod-edit-btn" onClick={e => handleEdit(e, prod.id)}>✏ Edit</button>
                    <button className="prod-del-btn"  onClick={e => handleDelete(e, prod.id)}>🗑 Hapus</button>
                  </div>
                )}
              </div>
              <div className="prod-body">
                <div className="prod-cat">{catLabel}</div>
                <div className="prod-name">{prod.name}</div>
                <div className="prod-price-custom">{prod.harga || 'Harga menyesuaikan desain'}</div>
                <a href={`https://wa.me/6281313811372?text=${prod.wa || ''}`}
                  target="_blank" rel="noreferrer" className="prod-tanya">
                  {WA_SVG} Tanya Harga →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <ProductModal
          product={editProd}
          onClose={() => { setModalOpen(false); setEditProd(null); }}
          onSaved={(msg) => { onToast(msg, 'success'); loadCatalog(); }}
        />
      )}
    </section>
  );
}
