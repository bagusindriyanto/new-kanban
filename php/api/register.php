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
  $name = isset($input["name"]) && trim($input["name"]) !== "" ? trim($input["name"]) : trim(explode(" ", $full_name)[0]);
  $nik = trim($input["nik"]);
  $division_id = $input["division_id"];
  $role_id = $input["role_id"];
  $email = trim($input["email"]);
  $password = $input["password"];

  // Cek isi field
  if (!$full_name || !$nik || !$division_id || !$role_id || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Semua field wajib diisi"]);
    exit;
  }

  // Cek email terdaftar
  $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
  $check_stmt->execute([$email]);
  $user_exists = $check_stmt->fetchColumn();

  if ($user_exists > 0) {
    http_response_code(400);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal membuat akun.",
      "error_detail" => "Email sudah terdaftar. Silahkan gunakan email lain."
    ]);
    exit;
  }

  // Cek jabatan & divisi valid di database
  $check_stmt = $pdo->prepare("SELECT id FROM divisions WHERE id = ?");
  $check_stmt->execute([$division_id]);
  if (!$check_stmt->fetch()) {
    http_response_code(422);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal membuat akun.",
      "error_detail" => "Divisi tidak valid."
    ]);
    exit;
  }

  $check_stmt = $pdo->prepare("SELECT id FROM roles WHERE id = ?");
  $check_stmt->execute([$role_id]);
  if (!$check_stmt->fetch()) {
    http_response_code(422);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal membuat akun.",
      "error_detail" => "Jabatan tidak valid."
    ]);
    exit;
  }

  // Hash password
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);

  try {
    $pdo->beginTransaction();

    // Daftarkan akun
    $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":email" => $email, ":password" => $hashed_password]);
    $user_id = $pdo->lastInsertId();

    $sql = "INSERT INTO pics (full_name, name, nik, user_id, division_id, role_id) VALUES (:full_name, :name, :nik, :user_id, :division_id, :role_id)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":full_name" => $full_name, ":name" => $name, ":nik" => $nik, ":user_id" => $user_id, ":division_id" => $division_id, ":role_id" => $role_id]);

    $pdo->commit();
    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Berhasil membuat akun."]);
  } catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal membuat akun.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
