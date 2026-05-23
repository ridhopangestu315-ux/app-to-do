<?php
/*
====================================================
API: HAPUS TODO
====================================================
File ini menghapus satu todo dari database.

Alur:
1. User klik tombol hapus pada todo
2. JavaScript (fetch) mengirim todo_id ke file ini
3. Cek login
4. Verifikasi: pastikan todo yang dihapus milik user yang login
   (cegah user lain menghapus todo user lain)
5. Hapus todo dari database
6. Return JSON response

REQUEST FORMAT:
{
  "id": 1
}

RESPONSE:
{
  "success": true,
  "message": "Todo berhasil dihapus"
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

if (!$data || !isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID todo tidak ada"]);
    exit;
}

$todo_id = (int)$data['id'];

// KEAMANAN: Verifikasi bahwa todo ini milik user yang login
// Cegah user lain menghapus todo user lain dengan langsung punya ID
$cek_owner = mysqli_query($koneksi, "SELECT id FROM todos WHERE id = $todo_id AND user_id = $user_id");

if (mysqli_num_rows($cek_owner) === 0) {
    echo json_encode(["success" => false, "message" => "Todo tidak ditemukan atau bukan milik Anda"]);
    exit;
}

// Hapus todo
$query = "DELETE FROM todos WHERE id = $todo_id AND user_id = $user_id";

if (mysqli_query($koneksi, $query)) {
    echo json_encode(["success" => true, "message" => "Todo berhasil dihapus"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menghapus todo: " . mysqli_error($koneksi)]);
}

mysqli_close($koneksi);
?>
