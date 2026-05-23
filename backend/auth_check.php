<?php
/*
====================================================
CEK SESSION LOGIN
====================================================
File ini memeriksa apakah user sudah login.
Jika belum login, redirect ke halaman login.

Cara kerja:
1. session_start() = mulai/lanjutkan session
2. Cek apakah $_SESSION['user_id'] ada
3. Jika tidak ada, user belum login → redirect ke login.php
4. Jika ada, user sudah login → biarkan lanjut

PENGGUNAAN:
- Letakkan di awal file PHP yang perlu proteksi login
  Contoh: include 'backend/auth_check.php'; (di awal dashboard.php)
====================================================
*/

// Mulai session (harus di awal sebelum output HTML)
session_start();

// Cek apakah $_SESSION['user_id'] ada
// $_SESSION['user_id'] adalah ID user yang login, dibuat saat proses login berhasil
if (!isset($_SESSION['user_id'])) {
    // Jika tidak ada (user belum login), redirect ke halaman login
    header("Location: ../login.html");
    exit(); // Hentikan eksekusi kode selanjutnya
}

// Jika sampai sini, artinya user sudah login
// File ini hanya untuk proteksi, tidak ada output
?>
