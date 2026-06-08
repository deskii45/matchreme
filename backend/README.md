# 🚀 Cara Menjalankan MS Merchandise + Backend MySQL

## Prasyarat

Pastikan sudah install:
- ✅ **Node.js** — https://nodejs.org (pilih versi LTS)
- ✅ **XAMPP** — https://www.apachefriends.org
- ✅ **HeidiSQL** — sudah include di XAMPP (atau download terpisah)

---

## Langkah 1 — Setup Database MySQL

### 1a. Jalankan XAMPP
- Buka **XAMPP Control Panel**
- Klik **Start** di baris **MySQL**
- Pastikan status hijau ✅

### 1b. Import database via HeidiSQL
1. Buka **HeidiSQL**
2. Klik **New** → isi:
   - Host: `127.0.0.1`
   - Port: `3306`
   - User: `root`
   - Password: *(kosong)*
3. Klik **Open**
4. Di menu: **File → Run SQL file...**
5. Pilih file: `backend/database.sql`
6. Klik **Open** → database otomatis dibuat ✅

### 1c. Cek via HeidiSQL
Di panel kiri akan muncul:
```
msforce_db
  ├── catalog    (12 produk)
  ├── users      (1 akun admin)
  └── favorites  (kosong)
```

---

## Langkah 2 — Jalankan Backend Server

Buka terminal/PowerShell di folder `backend/`:

```bash
cd "d:\SEMESTER 4\PEMJUT REG\msforce-main\msforce-main\backend"
node server.js
```

Jika berhasil akan muncul:
```
╔══════════════════════════════════════╗
║   MS Merchandise Backend Server      ║
╠══════════════════════════════════════╣
║  ✅ Server jalan di port 3000         ║
║  🌐 http://localhost:3000             ║
╚══════════════════════════════════════╝
✅ Terhubung ke MySQL database: msforce_db
```

---

## Langkah 3 — Buka Website

Buka file `msforce.html` di browser:
- Double-click file, atau
- Buka Chrome/Edge → drag file ke browser, atau
- Gunakan **VS Code Live Server**

---

## Akun Login

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Klien** | Daftar via modal | — |

---

## Struktur Folder

```
msforce-main/
├── msforce.html       ← Frontend utama
├── script.js          ← JavaScript (koneksi ke API)
├── style.css          ← Styling
├── *.jpg              ← Gambar produk
└── backend/
    ├── server.js      ← Express server (port 3000)
    ├── db.js          ← Koneksi MySQL
    ├── database.sql   ← Script buat database & tabel
    ├── package.json   ← Dependencies
    ├── node_modules/  ← (auto dibuat saat npm install)
    └── routes/
        ├── auth.js       ← /api/auth/login & /register
        ├── catalog.js    ← /api/catalog (CRUD)
        └── favorites.js  ← /api/favorites
```

---

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/catalog` | Ambil semua produk |
| POST | `/api/catalog` | Tambah produk (admin) |
| PUT | `/api/catalog/:id` | Edit produk (admin) |
| DELETE | `/api/catalog/:id` | Hapus produk (admin) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register klien |
| GET | `/api/favorites/:userId` | Daftar favorit |
| POST | `/api/favorites/toggle` | Toggle favorit |

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Gagal konek ke server" | Pastikan `node server.js` sudah jalan |
| "Gagal konek ke MySQL" | Pastikan XAMPP MySQL sudah Start |
| Katalog kosong | Import ulang `database.sql` via HeidiSQL |
| Port 3000 sudah dipakai | Edit PORT di `backend/server.js` |
