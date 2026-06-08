// backend/routes/favorites.js — Favorit Klien
const express = require('express');
const db      = require('../db');
const router  = express.Router();

// ── GET /api/favorites/:userId — ambil favorit user ──
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.* FROM favorites f
       JOIN catalog c ON f.product_id = c.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('[FAV GET ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal mengambil favorit.' });
  }
});

// ── GET /api/favorites/:userId/ids — ambil hanya ID favorit ──
router.get('/:userId/ids', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT product_id FROM favorites WHERE user_id = ?',
      [req.params.userId]
    );
    res.json({ ok: true, data: rows.map(r => r.product_id) });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Gagal mengambil ID favorit.' });
  }
});

// ── POST /api/favorites/toggle — toggle favorit ──
router.post('/toggle', async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ ok: false, msg: 'user_id dan product_id wajib diisi.' });
  }

  try {
    // Cek apakah sudah difavoritkan
    const [existing] = await db.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existing.length > 0) {
      // Sudah ada → hapus (unfavorite)
      await db.execute(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [user_id, product_id]
      );
      res.json({ ok: true, added: false, msg: 'Dihapus dari favorit.' });
    } else {
      // Belum ada → tambah (favorite)
      await db.execute(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [user_id, product_id]
      );
      res.json({ ok: true, added: true, msg: 'Ditambahkan ke favorit.' });
    }
  } catch (err) {
    console.error('[FAV TOGGLE ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Gagal memproses favorit.' });
  }
});

// ── DELETE /api/favorites/:userId/:productId — hapus favorit spesifik ──
router.delete('/:userId/:productId', async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.params.userId, req.params.productId]
    );
    res.json({ ok: true, msg: 'Favorit dihapus.' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Gagal menghapus favorit.' });
  }
});

module.exports = router;
