<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);

try {
  $sql = "INSERT INTO pics (username, password, role, name) VALUES (:name)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([":name" => $input["pic"]]);
  http_response_code(201);
  echo json_encode(
    ["id" => $pdo->lastInsertId(), "pic" => $input["pic"]],
    JSON_NUMERIC_CHECK,
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "status" => "error",
    "message" => "Gagal menambahkan PIC.",
    "error_detail" => $e->getMessage(),
  ]);
}
exit();

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM pics WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
  http_response_code(401);
  echo json_encode(["message" => "Username atau password salah."]);
  exit;
}

http_response_code(200);
echo json_encode(["message" => "Berhasil membuat akun."]);
