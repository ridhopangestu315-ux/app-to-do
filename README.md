# 📚 StudyFlow - Dokumentasi Setup Database & Backend

Selamat! Project Todo List Anda sudah ditransformasi menjadi sistem berbasis PHP + MySQL. Dokumen ini menjelaskan semua yang perlu Anda tahu.

---

## 🎯 Perubahan Utama

### Sebelumnya (Frontend Only)
- Data disimpan di **localStorage** browser
- Tidak ada sistem login
- Data hilang saat browser di-clear

### Sekarang (PHP + MySQL)
- Data disimpan di **database MySQL**
- ✅ Sistem login & register
- ✅ Setiap user punya data sendiri
- ✅ Data permanen di server
- ✅ Tampilan tetap sama (tidak berubah)

---

## 📁 Struktur Folder Project

```
app-to-do-php/
├── login.html                  ← Halaman login & register
├── dashboard.php               ← Halaman utama (dengan session check)
├── index.html                  ← DEPRECATED (gunakan dashboard.php)
├── home.css                    ← CSS (tidak berubah)
├── script.js                   ← DEPRECATED (gunakan script-database.js)
├── script-database.js          ← Script baru (terhubung database)
├── icon1.PNG                   ← Icon aplikasi
├── database.sql                ← Query SQL (untuk setup database)
├── backend/                    ← FOLDER BARU - Backend PHP
│   ├── koneksi.php            ← Koneksi ke database MySQL
│   ├── auth_check.php         ← Proteksi halaman jika belum login
│   ├── login.php              ← Proses login user
│   ├── register.php           ← Proses registrasi user baru
│   ├── logout.php             ← Proses logout
│   ├── tambah_todo.php        ← API tambah todo ke database
│   ├── ambil_todo.php         ← API ambil todo dari database
│   ├── hapus_todo.php         ← API hapus todo dari database
│   └── update_todo.php        ← API update status todo
└── README.md                   ← File ini
```

---

## 🚀 Setup Database (PENTING!)

### Step 1: Buka phpMyAdmin

1. Pastikan **Laragon** sudah running
2. Buka browser → `http://localhost/phpmyadmin`
3. Login (default: username=root, password=kosong)

### Step 2: Jalankan Query SQL

1. Klik tab **SQL**
2. Copy semua kode dari file **database.sql** di project folder
3. Paste ke textarea SQL di phpMyAdmin
4. Klik tombol **Go** / **Execute**

**Hasil yang seharusnya:**
- Database `studyflow` berhasil dibuat ✅
- Tabel `users` dibuat ✅
- Tabel `todos` dibuat ✅

### Step 3: Verifikasi Database

1. Di sidebar phpMyAdmin, klik **studyflow**
2. Seharusnya muncul 2 tabel: **users** dan **todos**

Sampai sini, database sudah siap! 🎉

---

## 🔑 Konfigurasi Koneksi Database

File: `backend/koneksi.php`

```php
$host = "localhost";      // Server MySQL (jangan diubah)
$user = "root";            // Username MySQL (Laragon default)
$password = "";            // Password MySQL (Laragon kosong)
$database = "studyflow";   // Nama database
```

**Jika Anda pakai konfigurasi berbeda:**
- Ubah nilai di file koneksi.php sesuai setup MySQL Anda

---

## 📖 Cara Menjalankan Project

### 1. Mulai Laragon

- Buka Laragon
- Pastikan MySQL & Apache running (tombol di Laragon)

### 2. Akses Aplikasi

- Buka browser
- Ketik: `http://localhost/app-to-do-php/login.html`

### 3. Registrasi Akun Baru

- Klik **"Daftar di sini"**
- Isi form: Nama, Email, Password (minimal 6 karakter)
- Klik **Daftar**

### 4. Login

- Gunakan email & password yang sudah didaftar
- Dashboard akan muncul dengan nama Anda

### 5. Gunakan Aplikasi

- Semua fitur sama seperti sebelumnya
- Tambah tugas, lihat kalender, ubah status
- Semua data tersimpan di database ✅

### 6. Logout

- Klik tombol **Logout** di sidebar

---

## 📝 Penjelasan File-File Backend

### 1. **koneksi.php**
**Fungsi:** Menyambungkan aplikasi ke database MySQL

```php
$koneksi = mysqli_connect($host, $user, $password, $database);
```

- Dipakai oleh semua file PHP lain
- Jika koneksi gagal, tampilkan error

### 2. **auth_check.php**
**Fungsi:** Melindungi halaman dari user yang belum login

```php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html");
    exit();
}
```

- Ditambahkan di awal dashboard.php
- Jika belum login → redirect ke login.html
- Jika sudah login → lanjut tampilkan dashboard

### 3. **login.php**
**Fungsi:** Proses login user

Alur:
1. Terima email & password dari form login
2. Cari user di database berdasarkan email
3. Verifikasi password dengan `password_verify()`
4. Jika cocok → buat session login
5. Return JSON response success/fail

Keamanan:
- `password_verify()` = check password yang dienkripsi
- `mysqli_real_escape_string()` = cegah SQL Injection

### 4. **register.php**
**Fungsi:** Proses registrasi user baru

Alur:
1. Terima: nama, email, password
2. Validasi data (email tidak kosong, password minimal 6 karakter)
3. Cek apakah email sudah terdaftar
4. Enkripsi password dengan `password_hash()`
5. Insert ke tabel users
6. Return JSON response success/fail

Keamanan:
- `password_hash()` = enkripsi one-way (aman)
- Validasi di backend (jangan percaya frontend saja)

### 5. **logout.php**
**Fungsi:** Menghapus session login

```php
session_destroy();
```

- Hapus semua data session
- User harus login ulang untuk akses aplikasi

### 6. **tambah_todo.php**
**Fungsi:** API untuk menambahkan todo baru

Request:
```json
{
  "nama_tugas": "Membuat Website",
  "mata_kuliah": "Pemrograman Web",
  "deadline": "2026-05-30"
}
```

Alur:
1. Cek session login
2. Validasi data (jangan kosong, deadline valid)
3. Insert ke tabel todos dengan user_id dari session
4. Return JSON response dengan data todo baru

### 7. **ambil_todo.php**
**Fungsi:** Mengambil semua todo user dari database

Response:
```json
{
  "success": true,
  "todos": [
    {
      "id": 1,
      "nama_tugas": "...",
      "mata_kuliah": "...",
      "deadline": "...",
      "sudah_selesai": 0
    }
  ]
}
```

- Dijalankan saat halaman dashboard dimuat
- Ambil semua todo WHERE user_id = $_SESSION['user_id']

### 8. **hapus_todo.php**
**Fungsi:** Menghapus todo dari database

Request:
```json
{
  "id": 1
}
```

Keamanan:
- Verifikasi bahwa todo ini milik user yang login
- Cegah user lain menghapus todo user lain

### 9. **update_todo.php**
**Fungsi:** Mengubah status todo (selesai/belum)

Request:
```json
{
  "id": 1,
  "sudah_selesai": 1
}
```

- sudah_selesai: 0 = belum, 1 = selesai
- Update di database

---

## 🔄 Alur Login & Database

### Diagram Alur Login

```
┌─ User buka login.html
│
├─ Fill form email & password
│
├─ Click "Masuk"
│
├─ Fetch ke backend/login.php (POST dengan email & password)
│
├─ PHP cari user di tabel users
│
├─ Jika email tidak ditemukan → Response: {"success": false, "message": "..."}
│
├─ Jika email ditemukan:
│  ├─ Verifikasi password dengan password_verify()
│  ├─ Jika password salah → Response error
│  ├─ Jika password benar:
│  │  ├─ Buat $_SESSION['user_id'] & $_SESSION['email']
│  │  └─ Response: {"success": true, "nama": "..."}
│
├─ JavaScript terima response success
│
├─ Redirect ke dashboard.php
│
└─ Dashboard.php jalankan auth_check.php
   ├─ Cek $_SESSION['user_id'] ada
   ├─ Jika tidak ada → redirect ke login.html
   └─ Jika ada → tampilkan dashboard + fetch data dari backend/ambil_todo.php
```

### Diagram Alur Tambah Todo

```
┌─ User di dashboard
│
├─ Fill form tugas: nama, mata kuliah, deadline
│
├─ Click "Tambah Tugas"
│
├─ JavaScript validasi form
│
├─ Fetch ke backend/tambah_todo.php dengan data
│
├─ PHP proses:
│  ├─ Cek session login
│  ├─ Validasi data
│  ├─ Insert ke tabel todos (dengan user_id dari session)
│  └─ Return JSON response dengan ID todo baru
│
├─ JavaScript terima response
│
├─ Tambah item ke DOM (atau refresh dari database)
│
└─ Render halaman kembali
```

### Session PHP

**Session = cara server mengingat siapa yang login**

Alur session:
1. Saat login berhasil:
   ```php
   $_SESSION['user_id'] = 123;
   $_SESSION['email'] = 'user@email.com';
   ```

2. PHP otomatis buat session file di server
3. Browser terima session ID (sebagai cookie)
4. Browser otomatis kirim session ID setiap kali request

5. Saat akses dashboard.php:
   ```php
   session_start();
   if (!isset($_SESSION['user_id'])) {
       // Belum login, redirect ke login
   }
   ```

6. Saat logout:
   ```php
   session_destroy();
   ```
   - Hapus file session di server
   - Browser cookie session menjadi invalid

---

## 🗄️ Database Schema

### Tabel: users

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| id | INT (PK) | ID unik user (auto increment) |
| email | VARCHAR(255) | Email user (UNIQUE, tidak boleh sama) |
| password | VARCHAR(255) | Password terenkripsi (password_hash) |
| nama_lengkap | VARCHAR(255) | Nama user |
| dibuat_pada | TIMESTAMP | Waktu user register |
| diupdate_pada | TIMESTAMP | Waktu terakhir update |

**Contoh data:**
```
id=1, email='budi@email.com', password='$2y$10$xyz...', nama_lengkap='Budi Santoso'
```

### Tabel: todos

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| id | INT (PK) | ID unik todo (auto increment) |
| user_id | INT (FK) | ID user pemilik todo |
| nama_tugas | VARCHAR(255) | Nama tugas |
| mata_kuliah | VARCHAR(255) | Mata kuliah terkait |
| deadline | DATE | Tanggal deadline |
| sudah_selesai | TINYINT | 0=belum, 1=selesai |
| dibuat_pada | TIMESTAMP | Waktu todo dibuat |

**Contoh data:**
```
id=5, user_id=1, nama_tugas='Laporan Praktikum', mata_kuliah='Pemrograman Web', deadline='2026-05-30', sudah_selesai=0
```

**Foreign Key:**
- user_id di tabel todos = mereferensi id di tabel users
- Jika user dihapus, semua todosnya juga terhapus (ON DELETE CASCADE)

---

## 🔐 Keamanan

### 1. Password Hashing
```php
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$valid = password_verify($password_input, $password_hash);
```

- `PASSWORD_DEFAULT` = bcrypt (algoritma terbaru yang aman)
- One-way: password tidak bisa di-decode
- Bahkan admin database tidak bisa tahu password asli

### 2. Session Login
```php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
}
```

- Proteksi halaman dari akses non-login
- Session file di server (aman dari browser)

### 3. SQL Injection Prevention
```php
mysqli_real_escape_string($koneksi, $email);
```

- Escape karakter khusus
- Cegah user input masuk sebagai SQL command

### 4. Validasi Backend
```php
if (empty($email) || strlen($password) < 6) {
    return error;
}
```

- Jangan percaya input frontend saja
- Validasi juga di backend

---

## ⚙️ Troubleshooting

### Error: "Koneksi gagal: Connection refused"

**Penyebab:** MySQL tidak running

**Solusi:**
1. Buka Laragon
2. Klik tombol **Start All**
3. Tunggu sampai Apache & MySQL running

### Error: "Tabel tidak ditemukan"

**Penyebab:** Database query SQL belum dijalankan

**Solusi:**
1. Buka phpMyAdmin
2. Jalankan query dari file database.sql
3. Verifikasi tabel sudah ada

### Error: "Email atau password salah" (tapi seharusnya benar)

**Penyebab:** Password tidak dienkripsi dengan password_hash()

**Solusi:**
- Jangan ubah cara enkripsi password
- Selalu gunakan password_hash() saat register
- Selalu gunakan password_verify() saat login

### Data todo tidak muncul setelah login

**Penyebab:** script-database.js tidak di-load

**Solusi:**
1. Buka dashboard.php
2. Cek script tag di akhir:
   ```html
   <script src="script-database.js"></script>
   ```
3. Jangan gunakan `script.js` lama

### Logout tidak bekerja

**Penyebab:** Tombol logout tidak terhubung dengan logout.php

**Solusi:**
- Pastikan file backend/logout.php ada
- Buka browser console (F12) untuk lihat error fetch

---

## 📱 Fitur yang Tetap Sama

Semua fitur di frontend tidak berubah:
- ✅ Tambah todo
- ✅ Hapus todo
- ✅ Mark todo selesai
- ✅ Kalender dengan deadline
- ✅ Search & filter
- ✅ Dark mode
- ✅ Mata kuliah custom
- ✅ Responsive mobile

Hanya penyimpanan data yang berubah dari **localStorage → MySQL Database**

---

## 🎓 Cara Belajar Dari Project Ini

### Pahami Alur Request-Response

1. **Frontend** (JavaScript/HTML)
   - User aksi (klik, form submit)
   - Fetch API kirim data ke backend

2. **Backend** (PHP)
   - Terima data dari fetch
   - Proses database (SELECT, INSERT, UPDATE, DELETE)
   - Return JSON response

3. **Frontend** (JavaScript)
   - Terima response dari backend
   - Update DOM atau render ulang
   - Tampilkan pesan toast

### Baca Kode Berurutan

1. `login.html` - Pahami form login & fetch request
2. `backend/login.php` - Pahami proses login di server
3. `dashboard.php` - Lihat session check & halaman utama
4. `script-database.js` - Lihat fetch API dan DOM rendering

### Modifikasi & Eksperimen

- Tambahkan kolom baru di tabel todos (contoh: prioritas/kategori)
- Ubah validasi (contoh: password minimal 8 karakter)
- Tambahkan fitur (contoh: edit todo)

---

## 📞 Kontak & Support

Jika ada error atau pertanyaan:
1. Cek Console Browser (F12) untuk error message
2. Cek terminal Laragon untuk MySQL/Apache errors
3. Buka phpMyAdmin untuk verifikasi data database

---

## ✨ Kesuksesan!

Selamat! Project Anda sudah berhasil ditransformasi dari front-end only menjadi full-stack dengan database. 🎉

**Tips berikutnya:**
- Backup database secara berkala
- Tambahkan fitur baru sesuai kebutuhan
- Belajar lebih lanjut tentang keamanan & optimization

Happy coding! 👨‍💻
