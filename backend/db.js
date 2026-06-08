// backend/db.js — Koneksi ke MySQL
const mysql = require('mysql2');

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',        // default XAMPP
  password : '',            // default XAMPP (kosong)
  database : 'msforce_db',
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0
});

const db = pool.promise();

// Test koneksi saat startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal konek ke MySQL:', err.message);
    console.error('   Pastikan MySQL XAMPP sudah dijalankan!');
  } else {
    console.log('✅ Terhubung ke MySQL database: msforce_db');
    connection.release();
  }
});

module.exports = db;
