<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case "POST":
    handlePost($pdo, $input);
    break;

  default:
    echo json_encode(["message" => "Invalid request method."]);
    break;
}

function handlePost($pdo, $input)
{

  $full_name = trim($input["full_name"]);
  $name = trim($input["name"]);
  $nik = trim($input["nik"]);
  $role = $input["role"];
  $username = trim($input["username"]);
  $password = $input["password"];

  // Cek isi field
  if (!$full_name || !$name || !$nik || !$role || !$username || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Semua field wajib diisi"]);
    exit;
  }

  // Cek username terdaftar
  $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM pics WHERE username = ?");
  $check_stmt->execute([$username]);
  $user_exists = $check_stmt->fetchColumn();

  if ($user_exists > 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Username sudah terdaftar. Silahkan gunakan username lain."]);
    exit;
  }

  // Hash password
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);

  try {
    // Daftarkan akun
    $sql = "INSERT INTO pics (full_name, name, nik, role, username, password) VALUES (:full_name, :name, :nik, :role, :username, :password)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":full_name" => $full_name, ":name" => $name, ":nik" => $nik, ":role" => $role, ":username" => $username, ":password" => $hashed_password]);
    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Berhasil membuat akun."]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal membuat akun.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
