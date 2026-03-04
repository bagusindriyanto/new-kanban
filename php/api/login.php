<?php
session_start();
header("Content-Type: application/json");

require_once "cors.php";
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
  http_response_code(401);

  echo json_encode([
    "status" => "error",
    "message" => "Login gagal.",
    "error_detail" => "Email atau kata sandi salah."
  ]);
  exit;
}

$user_id = $user['id'];

$sql = "SELECT p.id as id, p.name as name, d.name as division, r.name as role, r.level as level FROM pics p JOIN divisions d ON p.division_id = d.id JOIN roles r ON p.role_id = r.id WHERE p.user_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$pic = $stmt->fetch(PDO::FETCH_ASSOC);

// Simpan data user ke session
$_SESSION['user'] = [
  'id'   => $pic['id'],
  'name' => $pic['name'],
  'role' => $pic['role'],
  'division' => $pic['division'],
  'level' => $pic['level'],
];

http_response_code(200);
echo json_encode(["user" => $_SESSION['user']]);
