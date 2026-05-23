<?php
/*
====================================================
API: UPDATE STATUS TODO
====================================================
File ini mengubah status todo (selesai/belum selesai).

Alur:
1. User klik checkbox pada todo untuk mark complete/incomplete
2. JavaScript (fetch) mengirim todo_id dan status ke file ini
3. Cek login
4. Verifikasi ownership
5. Update kolom sudah_selesai di database (0 atau 1)
6. Return JSON response

REQUEST FORMAT:
{
  "id": 1,
  "sudah_selesai": 1
}

RESPONSE:
{
  "success": true,
  "message": "Todo berhasil diupdate",
  "sudah_selesai": 1
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

// Ambil data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id']) || !isset($data['sudah_selesai'])) {
    echo json_encode(["success" => false, "message" => "Data tidak lengkap"]);
    exit;
}

$todo_id = (int)$data['id'];
$sudah_selesai = (int)$data['sudah_selesai']; // 0 atau 1

// Verifikasi ownership
$cek_owner = mysqli_query($koneksi, "SELECT id FROM todos WHERE id = $todo_id AND user_id = $user_id");

if (mysqli_num_rows($cek_owner) === 0) {
    echo json_encode(["success" => false, "message" => "Todo tidak ditemukan atau bukan milik Anda"]);
    exit;
}

// Update status
$query = "UPDATE todos SET sudah_selesai = $sudah_selesai WHERE id = $todo_id AND user_id = $user_id";

if (mysqli_query($koneksi, $query)) {
    echo json_encode([
        "success" => true,
        "message" => "Todo berhasil diupdate",
        "sudah_selesai" => $sudah_selesai
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal mengupdate todo: " . mysqli_error($koneksi)]);
}

mysqli_close($koneksi);
?>
