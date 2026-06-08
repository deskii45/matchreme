// backend/routes/catalog.js — CRUD Produk
const express = require('express');
const db      = require('../db');
const router  = express.Router();

// ── GET /api/catalog — ambil semua produk ──
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM catalog ORDER BY id ASC'
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('[CATALOG GET ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal mengambil data katalog.' });
  }
});

// ── GET /api/catalog/:id — ambil satu produk ──
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM catalog WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan.' });
    }
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Gagal mengambil produk.' });
  }
});

// ── POST /api/catalog — tambah produk (admin only) ──
router.post('/', async (req, res) => {
  const { name, cat, img, alt, harga, wa } = req.body;

  if (!name || !cat) {
    return res.status(400).json({ ok: false, msg: 'Nama dan kategori wajib diisi.' });
  }

  const validCat = ['souvenir', 'ornamen', 'otomotif'];
  if (!validCat.includes(cat)) {
    return res.status(400).json({ ok: false, msg: 'Kategori tidak valid.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO catalog (name, cat, img, alt, harga, wa) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name,
        cat,
        img   || 'costum souvenir.jpg',
        alt   || name,
        harga || 'Harga menyesuaikan desain',
        wa    || `Halo,%20saya%20ingin%20tanya%20harga%20${encodeURIComponent(name)}`
      ]
    );

    const [newRow] = await db.execute(
      'SELECT * FROM catalog WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ ok: true, data: newRow[0], msg: 'Produk berhasil ditambahkan.' });

  } catch (err) {
    console.error('[CATALOG POST ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal menambah produk.' });
  }
});

// ── PUT /api/catalog/:id — update produk (admin only) ──
router.put('/:id', async (req, res) => {
  const { name, cat, img, alt, harga, wa } = req.body;
  const { id } = req.params;

  if (!name || !cat) {
    return res.status(400).json({ ok: false, msg: 'Nama dan kategori wajib diisi.' });
  }

  try {
    const [check] = await db.execute('SELECT id FROM catalog WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan.' });
    }

    await db.execute(
      'UPDATE catalog SET name=?, cat=?, img=?, alt=?, harga=?, wa=? WHERE id=?',
      [name, cat, img || '', alt || name, harga || 'Harga menyesuaikan desain', wa || '', id]
    );

    const [updated] = await db.execute('SELECT * FROM catalog WHERE id = ?', [id]);
    res.json({ ok: true, data: updated[0], msg: 'Produk berhasil diupdate.' });

  } catch (err) {
    console.error('[CATALOG PUT ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal mengupdate produk.' });
  }
});

// ── DELETE /api/catalog/:id — hapus produk (admin only) ──
router.delete('/:id', async (req, res) => {
  try {
    const [check] = await db.execute('SELECT id FROM catalog WHERE id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan.' });
    }

    await db.execute('DELETE FROM catalog WHERE id = ?', [req.params.id]);
    res.json({ ok: true, msg: 'Produk berhasil dihapus.' });

  } catch (err) {
    console.error('[CATALOG DELETE ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal menghapus produk.' });
  }
});

module.exports = router;
