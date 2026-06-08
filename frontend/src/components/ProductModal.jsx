// src/components/ProductModal.jsx — Modal tambah/edit produk (admin)
import { useState, useEffect } from 'react';
import { api } from '../api/api';

export default function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;

  const [name,  setName]  = useState(product?.name  || '');
  const [cat,   setCat]   = useState(product?.cat   || 'souvenir');
  const [harga, setHarga] = useState(product?.harga || '');
  const [img,   setImg]   = useState(product?.img   || '');
  const [alt,   setAlt]   = useState(product?.alt   || '');
  const [wa,    setWa]    = useState(product?.wa    || '');
  const [err,   setErr]   = useState('');
  const [load,  setLoad]  = useState(false);

  const handleSave = async () => {
    if (!name) { setErr('Nama produk wajib diisi.'); return; }
    setErr(''); setLoad(true);
    const data = {
      name, cat,
      harga: harga || 'Harga menyesuaikan desain',
      img:   img   || 'costum souvenir.jpg',
      alt:   alt   || name,
      wa:    wa    || `Halo,%20saya%20ingin%20tanya%20harga%20${encodeURIComponent(name)}`
    };
    try {
      const res = isEdit
        ? await api.updateProduct(product.id, data)
        : await api.addProduct(data);
      if (!res.ok) { setErr(res.msg || 'Gagal menyimpan.'); return; }
      onSaved(isEdit ? 'Produk berhasil diupdate! ✏' : 'Produk baru ditambahkan! 🎉');
      onClose();
    } catch {
      setErr('Gagal konek ke server.');
    } finally { setLoad(false); }
  };

  return (
    <>
      <div className="modal-overlay visible" onClick={onClose} />
      <div className="modal modal-wide" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <span className="modal-icon">📦</span>
        <h2>{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
        <p className="modal-sub">Isi detail produk katalog</p>

        <div className="mfg">
          <label>Nama Produk *</label>
          <input type="text" placeholder="Contoh: Keychain Custom Besi" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mfg-row">
          <div className="mfg">
            <label>Kategori *</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option value="souvenir">Souvenir</option>
              <option value="ornamen">Ornamen</option>
              <option value="otomotif">Otomotif</option>
            </select>
          </div>
          <div className="mfg">
            <label>Info Harga</label>
            <input type="text" placeholder="Harga menyesuaikan desain" value={harga} onChange={e => setHarga(e.target.value)} />
          </div>
        </div>
        <div className="mfg">
          <label>Nama File Gambar</label>
          <input type="text" placeholder="keychain.jpg" value={img} onChange={e => setImg(e.target.value)} />
        </div>
        <div className="mfg">
          <label>Alt Text Gambar</label>
          <input type="text" placeholder="Deskripsi singkat gambar" value={alt} onChange={e => setAlt(e.target.value)} />
        </div>
        <div className="mfg">
          <label>Teks Pesan WA</label>
          <input type="text" placeholder="Halo,%20saya%20ingin%20tanya..." value={wa} onChange={e => setWa(e.target.value)} />
        </div>

        {err && <div className="modal-err">{err}</div>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-main" onClick={handleSave} disabled={load}>
            {load ? 'Menyimpan...' : 'Simpan Produk →'}
          </button>
        </div>
      </div>
    </>
  );
}
