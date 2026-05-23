# 🎓 Panduan Mudah: Dari LocalStorage ke Database MySQL

Halo! Ini adalah penjelasan sederhana tentang apa yang sudah dikerjakan pada project Anda.

---

## 📊 Perubahan Besar

### Dulu (Cara Lama)
```
User → Browser → LocalStorage (hilang kalau di-clear cache)
```

Masalahnya:
- ❌ Data hilang kalau cache browser dihapus
- ❌ Tidak bisa login
- ❌ Tidak bisa beda akun
- ❌ Data hanya tersimpan di 1 device

### Sekarang (Cara Baru - Lebih Aman)
```
User → Login Form → Backend PHP → Database MySQL → Server (Aman!)
```

Keuntungan:
- ✅ Data tersimpan di server (permanen)
- ✅ Bisa login & logout
- ✅ Setiap user punya data sendiri
- ✅ Bisa diakses dari mana saja (laptop, hp, dll)
- ✅ Data tidak hilang

---

## 🔑 3 Hal Penting yang Perlu Anda Tahu

### 1. Login & Registrasi

**Sebelumnya:** Tidak ada, langsung pakai

**Sekarang:**
- Harus buat akun terlebih dahulu (register)
- Isi: Nama, Email, Password
- Password akan dienkripsi (disembunyikan) sebelum disimpan ke database
- Lalu login dengan email & password

```
Registrasi:
Nama: Budi Santoso
Email: budi@email.com
Password: rahasia123

↓ Password dienkripsi ↓

Tersimpan di database sebagai: $2y$10$xyz...abc...
(Tidak bisa dibaca, sangat aman)
```

### 2. Session & Cookie

**Apa itu Session?**

Session = cara server mengingat Anda sedang login

Alur:
1. Anda login → server buat session
2. Server kirim session ID ke browser (sebagai cookie)
3. Setiap kali Anda akses halaman, browser kirim cookie ini
4. Server cek cookie → "Oh, ini Budi yang sudah login"
5. Server tampilkan dashboard Anda
6. Saat logout → session dihapus → harus login lagi

```
Alur Session:
┌─ Login
├─ Server buat $_SESSION['user_id'] = 1
├─ Browser terima session ID
├─ Setiap request, browser kirim session ID
├─ Server cek → Anda adalah user #1
├─ Dashboard diperlihatkan
└─ Logout → session dihapus
```

### 3. Database & Tabel

**Database = Folder besar yang berisi data**

Database `studyflow` punya 2 tabel:

**Tabel USERS (untuk data akun)**
```
ID | Email              | Password (terenkripsi)  | Nama Lengkap
1  | budi@email.com     | $2y$10$xyz...          | Budi Santoso
2  | rani@email.com     | $2y$10$abc...          | Rani Wijaya
3  | tomi@email.com     | $2y$10$def...          | Tomi Arta
```

**Tabel TODOS (untuk data tugas - setiap user punya sendiri)**
```
ID | USER_ID | Nama Tugas           | Mata Kuliah      | Deadline   | Selesai
1  | 1       | Laporan Praktikum    | Pemrograman Web  | 2026-05-30 | 0
2  | 1       | Presentasi Kelompok  | Jaringan Komput  | 2026-05-25 | 1
3  | 2       | Tulis Essay          | Bahasa Inggris   | 2026-05-28 | 0
4  | 2       | Project Akhir        | Basis Data       | 2026-06-10 | 0
```

**Contoh:** 
- Budi (user_id=1) hanya bisa lihat tugas ID 1 & 2 miliknya
- Rani (user_id=2) hanya bisa lihat tugas ID 3 & 4 miliknya
- Tidak bisa lihat tugas user lain

---

## 📁 File-File Apa Saja yang Dibuat?

### File Login
- **login.html** - Halaman untuk login & register

### File Dashboard  
- **dashboard.php** - Halaman utama (HARUS login dulu)

### File Database
- **database.sql** - Perintah untuk bikin database (jalankan di phpMyAdmin sekali aja)

### Folder Backend (6 file PHP)
```
backend/
├─ koneksi.php       → Hubungi MySQL database
├─ login.php         → Proses login
├─ register.php      → Proses daftar akun baru
├─ logout.php        → Proses keluar/logout
├─ tambah_todo.php   → Tambah tugas baru ke database
├─ ambil_todo.php    → Ambil semua tugas dari database
├─ hapus_todo.php    → Hapus tugas dari database
└─ update_todo.php   → Ubah status tugas (selesai/belum)
```

### File JavaScript Baru
- **script-database.js** - Pengganti script.js (terhubung ke database)

### File Dokumentasi
- **README.md** - Dokumentasi lengkap

---

## 🚀 Setup (Langkah-Langkah Mudah)

### Step 1: Jalankan Query Database (Hanya 1 Kali!)

```
1. Buka Laragon
2. Klik "Start All"
3. Buka browser → http://localhost/phpmyadmin
4. Login (default: user=root, password=kosong)
5. Klik tab "SQL"
6. Copy SEMUA isi file "database.sql"
7. Paste ke form SQL di phpMyAdmin
8. Klik tombol "Go"
9. Tunggu sampai selesai ✅
```

Database sudah jadi!

### Step 2: Buka Aplikasi

```
1. Buka browser
2. Ketik: http://localhost/app-to-do-php/login.html
3. Muncul halaman login ✅
```

### Step 3: Buat Akun (Register)

```
1. Klik "Daftar di sini"
2. Isi form:
   - Nama: [nama Anda]
   - Email: user@email.com
   - Password: minimal6karakter
3. Klik tombol "Daftar"
4. Tunggu notifikasi "Registrasi berhasil"
5. Otomatis pindah ke form login ✅
```

### Step 4: Login

```
1. Email: [email yang didaftar]
2. Password: [password yang diisi]
3. Klik "Masuk"
4. Dashboard muncul dengan nama Anda ✅
```

### Step 5: Pakai Aplikasi

Semua fitur sama seperti sebelumnya:
- ✅ Tambah tugas
- ✅ Hapus tugas
- ✅ Mark selesai
- ✅ Lihat kalender
- ✅ Search & filter
- ✅ Dark mode
- ✅ Semua fitur tetap sama!

### Step 6: Logout

- Klik tombol "Logout" di sidebar kiri
- Akan kembali ke halaman login

---

## 🔐 Keamanan (Penjelasan Mudah)

### 1. Password Dienkripsi

Password TIDAK disimpan langsung:
```
Yang Anda masukkan: rahasia123
Yang tersimpan:     $2y$10$xyz...abc...
                    (Tidak bisa dibaca balik)
```

Saat login:
```
Anda masukkan: rahasia123
Database punya: $2y$10$xyz...abc...
Server: Cocok ga? (password_verify)
Hasil: Cocok! ✅ Login berhasil
```

**Mengapa aman?**
- Bahkan admin database tidak tahu password asli Anda
- Kalau database diretas, password tetap aman
- Tidak bisa di-decode balik

### 2. Setiap User Punya Data Sendiri

```
User 1 (Budi):
- Email: budi@email.com
- Tugas: [Laporan, Presentasi]

User 2 (Rani):
- Email: rani@email.com
- Tugas: [Essay, Project]

Budi tidak bisa lihat tugas Rani ✅
Rani tidak bisa lihat tugas Budi ✅
Masing-masing punya data sendiri
```

### 3. Session = Bukti Login

```
Login berhasil → Server bikin session
Browser terima ID session (cookie)
Browser kirim ID session setiap kali akses
Server cek → "OK, ini Budi"
Logout → Hapus session → Harus login lagi
```

---

## 🎨 Desain & Tampilan (TIDAK BERUBAH!)

✅ Warna tetap sama (biru + tema gelap)
✅ Layout tetap sama (sidebar + main content)
✅ Animasi tetap sama
✅ Responsive mobile tetap sama
✅ Semua tombol & form tetap sama

**Hanya perbedaan:**
- Ada halaman login baru
- Ada tombol logout di sidebar
- Data sekarang dari database (tidak localStorage)

---

## ⚠️ Troubleshooting Singkat

### Error: "Koneksi gagal"
```
❌ Laragon tidak running
✅ Solusi: Buka Laragon, klik "Start All"
```

### Error: "Tabel tidak ditemukan"
```
❌ Query database.sql belum dijalankan
✅ Solusi: Jalankan file database.sql di phpMyAdmin
```

### Todo tidak muncul
```
❌ Belum login
✅ Solusi: Login terlebih dahulu
```

### Tombol logout error
```
❌ File backend/logout.php tidak ada atau error
✅ Solusi: Cek apakah file backend/logout.php ada di folder
```

---

## 🎓 Pelajaran Penting

Sekarang Anda sudah memahami:

1. **Login/Register**: Cara membuat akun dengan password yang aman
2. **Session**: Cara server mengingat siapa yang login
3. **Database**: Cara menyimpan data yang permanen
4. **API**: Cara frontend berkomunikasi dengan backend
5. **Keamanan**: Password encryption, SQL prevention, dll

Ini adalah fondasi dari hampir semua aplikasi web modern! 🎉

---

## 💡 Tips Lanjutan

Setelah bisa menjalankan project ini, Anda bisa:

1. **Tambah fitur baru**: Misalnya edit tugas, kategori tugas, dll
2. **Ubah database**: Tambah kolom baru (prioritas, tags, dll)
3. **Belajar framework**: Setelah paham PHP vanilla, pelajari Laravel/CodeIgniter
4. **Deploy ke internet**: Upload ke hosting agar bisa diakses dari mana saja
5. **Mobile app**: Buat aplikasi mobile yang pakai API yang sama

---

## 🙏 Kesimpulan

Project Anda sekarang:
- ✅ Sudah punya sistem login yang aman
- ✅ Sudah punya database MySQL
- ✅ Sudah full-stack (frontend + backend + database)
- ✅ Tampilan tetap sama dan indah
- ✅ Siap untuk dikembangkan lebih lanjut

**Selamat! Anda sudah bikin aplikasi web yang sesungguhnya!** 🚀

---

## 📞 Butuh Bantuan?

1. Baca file README.md untuk penjelasan teknis yang lebih detail
2. Cek komentar di setiap file PHP (sudah dijelaskan fungsinya)
3. Lihat Network tab di browser DevTools (F12) untuk lihat fetch request
4. Buka Console untuk lihat error message

Happy coding! 💻✨
