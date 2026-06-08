const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  const connection = await mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    port     : process.env.MYSQL_PORT || 3306,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'database.sql'),
    'utf8'
  );

  await connection.query(sql);
  console.log('Database berhasil di-import!');
  await connection.end();
}

main().catch(err => {
  console.error('Gagal import:', err.message);
  process.exit(1);
});
