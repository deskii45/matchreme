const db = require('./db');

async function migrate() {
  await db.query(`CREATE TABLE IF NOT EXISTS catalog (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255)                            NOT NULL,
    cat        ENUM('souvenir','ornamen','otomotif')   NOT NULL DEFAULT 'souvenir',
    img        VARCHAR(255)                            NOT NULL DEFAULT 'costum souvenir.jpg',
    alt        VARCHAR(255)                            NOT NULL DEFAULT '',
    harga      VARCHAR(255)                            NOT NULL DEFAULT 'Harga menyesuaikan desain',
    wa         TEXT,
    created_at TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);

  await db.query(`CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nama       VARCHAR(255)  NOT NULL,
    username   VARCHAR(100)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role       ENUM('admin','client') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);

  await db.query(`CREATE TABLE IF NOT EXISTS favorites (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fav (user_id, product_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES catalog(id) ON DELETE CASCADE
  ) ENGINE=InnoDB`);
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM catalog');
  if (rows[0].count === 0) {
    await db.query(`
      INSERT INTO catalog (name, cat, img, alt, harga, wa) VALUES
        ('Keychain Custom', 'souvenir', 'keychain.jpg', 'Keychain Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Keychain%20Custom'),
        ('Nomor Rumah Custom', 'souvenir', 'plat rumah.jpg', 'Nomor Rumah Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Nomor%20Rumah%20Custom'),
        ('Jam Besi Custom', 'souvenir', 'jam.jpg', 'Jam Besi Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Jam%20Besi%20Custom'),
        ('Plakat Custom', 'souvenir', 'plakat.jpg', 'Plakat Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Plakat%20Custom'),
        ('Custom Souvenir Lainnya (Request)', 'souvenir', 'costum souvenir.jpg', 'Souvenir Custom Lainnya', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20souvenir%20custom'),
        ('Ornamen Pagar Rumah Custom', 'ornamen', 'pagar.jpg', 'Ornamen Pagar Rumah', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Ornamen%20Pagar%20Rumah'),
        ('Hiasan Dinding Custom', 'ornamen', 'hiasan dinding.jpg', 'Hiasan Dinding Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Hiasan%20Dinding'),
        ('Partisi Ruangan Custom', 'ornamen', 'partisi.jpg', 'Partisi Ruangan Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Partisi%20Ruangan'),
        ('Custom Ornamen Lainnya (Request)', 'ornamen', 'costum ornamen.jpg', 'Ornamen Custom Lainnya', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20ornamen%20custom'),
        ('Pijakan Kaki Motor Custom', 'otomotif', 'pijakan.jpg', 'Bordes Pijakan Kaki Motor', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Bordes%20Motor'),
        ('Tameng Knalpot Custom', 'otomotif', 'tameng.jpg', 'Tameng Knalpot Custom', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20harga%20Tameng%20Knalpot'),
        ('Custom Part Otomotif Lainnya (Request)', 'otomotif', 'costum otomotif.jpg', 'Custom Part Otomotif', 'Harga menyesuaikan desain', 'Halo,%20saya%20ingin%20tanya%20custom%20part%20otomotif');
    `);
  }
  const [userRows] = await db.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', ['admin']);
  if (userRows[0].count === 0) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);
    await db.query('INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)', ['Administrator', 'admin', hash, 'admin']);
  }
  console.log('Migrasi database selesai.');
}

module.exports = migrate;
