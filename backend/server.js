// backend/server.js — Express Server Utama
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const catalogRoutes   = require('./routes/catalog');
const authRoutes      = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const db = require('./db');

const migrate = require('./migrate');
const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors({
  origin: '*', // izinkan semua origin (untuk development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── SERVE STATIC FILES (gambar produk) ──
app.use('/public', express.static(path.join(__dirname, '..', 'frontend', 'public')));

// ── API ROUTES ──
app.use('/api/catalog',   catalogRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api/favorites', favoritesRoutes);

// ── ROUTE UTAMA — cek server jalan ──
app.get('/api', (req, res) => {
  res.json({
    ok     : true,
    msg    : '🔧 MS Merchandise API aktif',
    version: '1.0.0',
    endpoints: {
      catalog  : '/api/catalog',
      auth     : '/api/auth/login | /api/auth/register',
      favorites: '/api/favorites/:userId | /api/favorites/toggle'
    }
  });
});

// ── GET /api/health — diagnosa ──
app.get('/api/health', async (req, res) => {
  const result = { ok: true, db: false, tables: [] };
  try {
    await db.query('SELECT 1');
    result.db = true;
    const [tables] = await db.query('SHOW TABLES');
    result.tables = tables.map(t => Object.values(t)[0]);
  } catch (err) {
    result.ok = false;
    result.error = err.message;
  }
  res.json(result);
});

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: `Endpoint ${req.method} ${req.path} tidak ditemukan.` });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ ok: false, msg: 'Internal server error.' });
});

// ── MIGRASI DB ──
migrate().then(() => {
  console.log('✅ Database siap.');
}).catch(err => {
  console.warn('⚠️ Migrasi error (akan dilanjutkan):', err.message);
});

// ── START SERVER ──
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   MS Merchandise Backend Server      ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  ✅ Server jalan di port ${PORT}         ║`);
  console.log(`║  🌐 http://localhost:${PORT}             ║`);
  console.log(`║  📦 API: http://localhost:${PORT}/api    ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log('  Buka msforce.html di browser untuk mulai.');
  console.log('  Ctrl+C untuk menghentikan server.\n');
});
