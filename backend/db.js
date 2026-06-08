// backend/db.js — Koneksi ke MySQL (Railway / local)
const mysql = require('mysql2');

const pool = mysql.createPool({
  host     : process.env.MYSQL_HOST || 'localhost',
  user     : process.env.MYSQL_USER || 'root',
  password : process.env.MYSQL_PASSWORD || '',
  database : process.env.MYSQL_DATABASE || 'msforce_db',
  port     : process.env.MYSQL_PORT || 3306,
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
