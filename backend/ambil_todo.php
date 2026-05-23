<?php
/*
====================================================
API: AMBIL SEMUA TODO USER
====================================================
File ini mengambil semua todo dari user yang login.

Alur:
1. Saat halaman dashboard dimuat, fetch request ke file ini
2. Cek session login
3. Ambil semua todo dari tabel todos WHERE user_id = $_SESSION['user_id']
4. Urutkan berdasarkan dibuat_pada (terbaru dulu)
5. Return JSON array berisi semua todo user

REQUEST: GET /backend/ambil_todo.php
Response FORMAT:
{
  "success": true,
  "todos": [
    {
      "id": 1,
      "nama_tugas": "Membuat Website",
      "mata_kuliah": "Pemrograman Web",
      "deadline": "2026-05-30",
      "sudah_selesai": 0,
      "dibuat_pada": "2026-05-23 10:30:00"
    },
    ...
  ]
}
====================================================
*/

header("Content-Type: application/json");

session_start();
include 'koneksi.php';

// Cek login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User belum login"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Query ambil semua todo user (diurutkan terbaru dulu)
$query = "SELECT id, nama_tugas, mata_kuliah, deadline, sudah_selesai, dibuat_pada
FROM todos
WHERE user_id = $user_id
ORDER BY dibuat_pada DESC";

$result = mysqli_query($koneksi, $query);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Error query: " . mysqli_error($koneksi)]);
    exit;
}

// Ambil semua hasil query
$todos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $todos[] = $row;
}

echo json_encode([
    "success" => true,
    "todos" => $todos
]);

mysqli_close($koneksi);
?>
