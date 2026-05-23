<?php
/*
====================================================
PROSES LOGIN USER
====================================================
File ini menangani saat user ingin login ke aplikasi.

Alur login:
1. User mengisi email dan password di form login
2. JavaScript (fetch) mengirim email & password ke file ini
3. Cari user berdasarkan email di database
4. Jika email tidak ditemukan → login gagal
5. Jika email ditemukan, verifikasi password:
   - password_verify() = check apakah password cocok dengan yang terenkripsi
   - Jika password salah → login gagal
   - Jika password benar → login berhasil
6. Jika berhasil:
   - Buat $_SESSION['user_id'] dan $_SESSION['email']
   - Session ini akan diingat selama browser masih terbuka
   - Return JSON: {"success": true, "user_id": ..., "nama": ...}
7. Jika gagal: Return JSON dengan pesan error

SESSION DALAM PHP:
- Session = cara browser mengingat user login
- Setiap user login mendapat session ID unik
- Session tersimpan di server (file atau database)
- Session ID dikirim ke browser sebagai cookie
- Browser otomatis mengirim cookie setiap kali request
- Dengan cara ini, server tahu siapa yang login tanpa minta password lagi
====================================================
*/

header("Content-Type: application/json");

session_start(); // Mulai session untuk menyimpan user_id

include 'koneksi.php'; // Ambil koneksi database

// Ambil data dari fetch (request JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Validasi: apakah ada data?
if (!$data) {
    echo json_encode(["success" => false, "message" => "Tidak ada data yang dikirim"]);
    exit;
}

// Ambil email dan password
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// Validasi: apakah email dan password tidak kosong?
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email dan password tidak boleh kosong"]);
    exit;
}

// Cari user di database berdasarkan email
$query = "SELECT id, email, password, nama_lengkap FROM users WHERE email = '" . mysqli_real_escape_string($koneksi, $email) . "'";
$result = mysqli_query($koneksi, $query);

// Jika query error
if (!$result) {
    echo json_encode(["success" => false, "message" => "Database error: " . mysqli_error($koneksi)]);
    exit;
}

// Cek apakah user ditemukan
if (mysqli_num_rows($result) === 0) {
    // User tidak ditemukan di database
    echo json_encode(["success" => false, "message" => "Email atau password salah"]);
    exit;
}

// Ambil data user dari database
$user = mysqli_fetch_assoc($result);

// Verifikasi password dengan password_verify()
// password_verify($password_biasa, $password_terenkripsi) = true jika cocok
if (!password_verify($password, $user['password'])) {
    // Password salah
    echo json_encode(["success" => false, "message" => "Email atau password salah"]);
    exit;
}

// Password benar! Buat session login
$_SESSION['user_id'] = $user['id'];
$_SESSION['email'] = $user['email'];
$_SESSION['nama'] = $user['nama_lengkap'];

// Login berhasil, return response sukses
echo json_encode([
    "success" => true,
    "message" => "Login berhasil!",
    "user_id" => $user['id'],
    "nama" => $user['nama_lengkap']
]);

mysqli_close($koneksi);
?>
