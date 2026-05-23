<?php
/*
====================================================
KONEKSI DATABASE
====================================================
File ini bertugas menyambungkan aplikasi ke database MySQL.

Cara kerja:
1. mysqli_connect() = membuka koneksi ke database
2. Jika koneksi gagal, tampilkan error
3. set_charset() = atur encoding agar karakter Indonesia (ä, é, ü) terbaca dengan benar
====================================================
*/

// Konfigurasi database
$host = "localhost";      // Alamat server MySQL (biasanya localhost untuk komputer lokal)
$user = "root";            // Username MySQL (default: root di Laragon)
$password = "";            // Password MySQL (default: kosong di Laragon)
$database = "studyflow";   // Nama database yang sudah dibuat di phpMyAdmin

// Buat koneksi ke database
$koneksi = mysqli_connect($host, $user, $password, $database);

// Cek apakah koneksi berhasil
if (!$koneksi) {
    // Jika gagal, tampilkan error dan hentikan program
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Atur encoding karakter (UTF-8) agar teks Indonesia bisa disimpan dengan benar
mysqli_set_charset($koneksi, "utf8mb4");

// Jika berhasil, variabel $koneksi siap digunakan di file-file lain
// Contoh penggunaan di file lain: include 'koneksi.php'; (untuk pakai $koneksi)
?>
