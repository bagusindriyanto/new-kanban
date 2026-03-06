<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "auth.php";
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case "PATCH":
    handlePatch($pdo, $input);
    break;

  default:
    echo json_encode(["message" => "Invalid request method."]);
    break;
}

// fungsi untuk menangani request PATCH
function handlePatch($pdo, $input)
{
  $id = $_SESSION['user']['user_id'];
  $full_name = trim($input["full_name"]);
  $name = isset($input["name"]) && trim($input["name"]) !== "" ? trim($input["name"]) : trim(explode(" ", $full_name)[0]);
  $nik = trim($input["nik"]);
  $email = trim($input["email"]);
  $password = $input["password"];

  // Cek isi field
  if (!$full_name || !$nik || !$email || !$password || !$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Semua field wajib diisi"]);
    exit;
  }

  // Cek id user
  $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
  $check_stmt->execute([$id]);
  $user_exists = $check_stmt->fetchColumn();

  if ($user_exists === 0) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Gagal mengubah data.", "error_detail" => "User tidak ditemukan."]);
    exit;
  }

  // Cek email terdaftar
  $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ? AND id <> ?");
  $check_stmt->execute([$email, $id]);
  $user_exists = $check_stmt->fetchColumn();

  if ($user_exists > 0) {
    http_response_code(400);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal mengubah data.",
      "error_detail" => "Email sudah terdaftar. Silahkan gunakan email lain."
    ]);
    exit;
  }

  // Hash password
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);

  try {
    $pdo->beginTransaction();

    // Update user
    $sql = "UPDATE users SET email = :email, password = :password WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":email" => $email, ":password" => $hashed_password, ":id" => $id]);

    $sql = "UPDATE pics SET full_name = :full_name, name = :name, nik = :nik WHERE user_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":full_name" => $full_name, ":name" => $name, ":nik" => $nik, ":id" => $id]);

    $pdo->commit();

    // Update session
    $_SESSION['user']['name'] = $name;

    http_response_code(201);
    echo json_encode([
      "status" => "success",
      "message" => "Berhasil mengubah data.",
      "user" => $_SESSION['user']
    ], JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal mengubah data.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
