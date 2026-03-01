<?php
session_start();
header("Content-Type: application/json");

// Tambahkan cors.php agar request dari React tidak diblokir
require_once "cors.php";

// Kosongkan array $_SESSION
$_SESSION = [];

// Hapus cookie session dari browser (opsional tapi disarankan)
if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(
    session_name(),
    '',
    time() - 42000,
    $params["path"],
    $params["domain"],
    $params["secure"],
    $params["httponly"]
  );
}

// Hancurkan session di server
session_destroy();

echo json_encode(["message" => "Logout berhasil"]);
