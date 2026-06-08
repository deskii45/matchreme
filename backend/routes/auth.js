// backend/routes/auth.js — Login & Register
const express  = require('express');
const bcrypt   = require('bcryptjs');
const db       = require('../db');
const router   = express.Router();

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, msg: 'Username dan password wajib diisi.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, msg: 'Username atau password salah.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ ok: false, msg: 'Username atau password salah.' });
    }

    // Jangan kirim password ke frontend
    const { password: _, ...safeUser } = user;
    res.json({ ok: true, user: safeUser });

  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Terjadi kesalahan server.' });
  }
});

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  const { nama, username, password } = req.body;

  if (!nama || !username || !password) {
    return res.status(400).json({ ok: false, msg: 'Semua field wajib diisi.' });
  }
  if (username.length < 3) {
    return res.status(400).json({ ok: false, msg: 'Username minimal 3 karakter.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ ok: false, msg: 'Password minimal 6 karakter.' });
  }

  try {
    // Cek username sudah ada
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ ok: false, msg: 'Username sudah dipakai, coba yang lain.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)',
      [nama, username, hashed, 'client']
    );

    const newUser = {
      id      : result.insertId,
      nama    : nama,
      username: username,
      role    : 'client'
    };

    res.status(201).json({ ok: true, user: newUser });

  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ ok: false, msg: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
