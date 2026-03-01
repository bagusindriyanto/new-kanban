<?php
session_start();
header("Content-Type: application/json");

require_once "cors.php";
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
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

// Simpan data user ke session
$_SESSION['user'] = [
  'id'   => $user['id'],
  'name' => $user['name'],
  'role' => $user['role'],
];

http_response_code(200);
echo json_encode(["user" => $_SESSION['user']]);
