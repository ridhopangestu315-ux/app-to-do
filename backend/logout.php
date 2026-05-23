<?php
/*
====================================================
PROSES LOGOUT
====================================================
File ini menangani saat user ingin keluar/logout dari aplikasi.

Alur logout:
1. User klik tombol logout
2. JavaScript (fetch) mengirim request ke file ini
3. Hapus semua $_SESSION (session_destroy())
4. Redirect atau return response ke dashboard
5. Frontend redirect ke halaman login

SESSION_DESTROY():
- Menghapus semua data session di server
- Browser tidak lagi mengingat siapa yang login
- User harus login ulang untuk mengakses aplikasi lagi
====================================================
*/

header("Content-Type: application/json");

session_start(); // Mulai session

// Hapus semua data session
session_destroy();

// Return response sukses (bisa dipake di JavaScript untuk redirect)
echo json_encode([
    "success" => true,
    "message" => "Logout berhasil"
]);
?>
