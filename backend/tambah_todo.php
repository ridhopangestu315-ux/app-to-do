<?php
/*
====================================================
API: TAMBAH TODO BARU
====================================================
File ini menangani saat user ingin membuat todo baru.

Alur:
1. User isi form "Tambah Tugas" di dashboard
2. JavaScript (fetch) mengirim data ke file ini
3. Cek session login (pastikan user sudah login)
4. Validasi data:
   - nama_tugas tidak boleh kosong
   - mata_kuliah tidak boleh kosong
   - deadline tidak boleh kosong
5. Insert todo ke tabel todos dengan user_id dari session
6. Return JSON: {"success": true, "todo": {...}} atau error

REQUEST FORMAT (dari fetch):
{
  "nama_tugas": "Membuat Website",
  "mata_kuliah": "Pemrograman Web",
  "deadline": "2026-05-30"
}

RESPONSE FORMAT:
{
  "success": true,
  "message": "Todo berhasil ditambahkan",
  "todo": {
    "id": 1,
    "nama_tugas": "...",
    "mata_kuliah": "...",
    "deadline": "...",
    "sudah_selesai": 0,
    "dibuat_pada": "2026-05-23 10:30:00"
  }
}
====================================================
*/

header("Content-Type: application/json");

session_start();
include 'koneksi.php';

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User belum login"]);
    exit;
}

// Ambil user_id dari session
$user_id = $_SESSION['user_id'];

// Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Tidak ada data"]);
    exit;
}

// Ambil nilai dengan validasi
$nama_tugas = isset($data['nama_tugas']) ? trim($data['nama_tugas']) : '';
$mata_kuliah = isset($data['mata_kuliah']) ? trim($data['mata_kuliah']) : '';
$deadline = isset($data['deadline']) ? trim($data['deadline']) : '';

// Validasi
if (empty($nama_tugas)) {
    echo json_encode(["success" => false, "message" => "Nama tugas tidak boleh kosong"]);
    exit;
}

if (empty($mata_kuliah)) {
    echo json_encode(["success" => false, "message" => "Mata kuliah tidak boleh kosong"]);
    exit;
}

if (empty($deadline)) {
    echo json_encode(["success" => false, "message" => "Deadline tidak boleh kosong"]);
    exit;
}

// Insert ke database
$query = "INSERT INTO todos (user_id, nama_tugas, mata_kuliah, deadline, sudah_selesai)
VALUES (
    $user_id,
    '" . mysqli_real_escape_string($koneksi, $nama_tugas) . "',
    '" . mysqli_real_escape_string($koneksi, $mata_kuliah) . "',
    '" . mysqli_real_escape_string($koneksi, $deadline) . "',
    0
)";

if (mysqli_query($koneksi, $query)) {
    // Ambil ID todo yang baru saja dimasukkan
    $todo_id = mysqli_insert_id($koneksi);
    
    // Ambil data todo yang baru
    $query_ambil = "SELECT id, nama_tugas, mata_kuliah, deadline, sudah_selesai, dibuat_pada FROM todos WHERE id = $todo_id";
    $result = mysqli_query($koneksi, $query_ambil);
    $todo = mysqli_fetch_assoc($result);
    
    echo json_encode([
        "success" => true,
        "message" => "Todo berhasil ditambahkan",
        "todo" => $todo
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menambahkan todo: " . mysqli_error($koneksi)]);
}

mysqli_close($koneksi);
?>
