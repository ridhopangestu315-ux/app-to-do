<?php
/*
====================================================
PROSES REGISTRASI USER BARU
====================================================
File ini menangani saat user ingin membuat akun baru.

Alur registrasi:
1. User mengisi form: email, password, nama
2. JavaScript (fetch) mengirim data ke file ini
3. Validasi data:
   - Email tidak boleh kosong
   - Password minimal 6 karakter
   - Email tidak boleh sudah terdaftar di database
4. Password di-enkripsi dengan password_hash()
   - password_hash() membuat password sulit dipecahkan
   - Bahkan admin database tidak bisa tahu password asli user
5. Data tersimpan ke tabel users di database
6. Return JSON response: {"success": true} atau {"success": false, "message": "..."}

KEAMANAN:
- password_hash() = enkripsi satu arah (tidak bisa di-decode)
- mysqli_real_escape_string() = cegah SQL Injection
- Validasi input di backend (jangan percaya frontend saja)
====================================================
*/

header("Content-Type: application/json");

include 'koneksi.php'; // Ambil koneksi database dari file koneksi.php

// Ambil data dari request (dari fetch API di script.js)
// $_POST hanya bekerja dengan form encoding normal
// Karena fetch mengirim JSON, gunakan php://input
$data = json_decode(file_get_contents("php://input"), true);

// Validasi: apakah ada data yang dikirim?
if (!$data) {
    echo json_encode(["success" => false, "message" => "Tidak ada data yang dikirim"]);
    exit;
}

// Ambil nilai dari data (dengan trim() untuk hapus spasi di awal/akhir)
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';
$nama = isset($data['nama']) ? trim($data['nama']) : '';

// Validasi: apakah email kosong?
if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email tidak boleh kosong"]);
    exit;
}

// Validasi: apakah password kosong dan minimal 6 karakter?
if (empty($password) || strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Password minimal 6 karakter"]);
    exit;
}

// Validasi: apakah nama kosong?
if (empty($nama)) {
    echo json_encode(["success" => false, "message" => "Nama tidak boleh kosong"]);
    exit;
}

// Cek apakah email sudah terdaftar di database
$cek_email = mysqli_query($koneksi, "SELECT id FROM users WHERE email = '" . mysqli_real_escape_string($koneksi, $email) . "'");

// Jika query menemukan hasil (email sudah ada)
if (mysqli_num_rows($cek_email) > 0) {
    echo json_encode(["success" => false, "message" => "Email sudah terdaftar. Gunakan email lain atau login."]);
    exit;
}

// Enkripsi password dengan password_hash()
// PASSWORD_DEFAULT = algoritma terbaru yang aman (bcrypt)
$password_terenkripsi = password_hash($password, PASSWORD_DEFAULT);

// Insert data user baru ke tabel users
$query_insert = "INSERT INTO users (email, password, nama_lengkap) VALUES (
    '" . mysqli_real_escape_string($koneksi, $email) . "',
    '" . mysqli_real_escape_string($koneksi, $password_terenkripsi) . "',
    '" . mysqli_real_escape_string($koneksi, $nama) . "'
)";

// Jalankan query
if (mysqli_query($koneksi, $query_insert)) {
    // Jika berhasil, return response sukses
    echo json_encode([
        "success" => true,
        "message" => "Registrasi berhasil! Silakan login dengan akun baru Anda."
    ]);
} else {
    // Jika gagal, tampilkan error
    echo json_encode([
        "success" => false,
        "message" => "Gagal membuat akun: " . mysqli_error($koneksi)
    ]);
}

mysqli_close($koneksi);
?>
