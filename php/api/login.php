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

$sql = "SELECT p.id as id, p.full_name as full_name, p.name as name, p.nik as nik, d.name as division, r.name as role, r.level as level FROM pics p JOIN divisions d ON p.division_id = d.id JOIN roles r ON p.role_id = r.id WHERE p.user_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$pic = $stmt->fetch(PDO::FETCH_ASSOC);

// Simpan data user ke session
$_SESSION['user'] = [
  'user_id' => $user_id,
  'id'   => $pic['id'],
  'full_name' => $pic['full_name'],
  'name' => $pic['name'],
  'nik' => $pic['nik'],
  'role' => $pic['role'],
  'email' => $user['email'],
  'division' => $pic['division'],
  'level' => $pic['level'],
];

http_response_code(200);
echo json_encode(["user" => $_SESSION['user']], JSON_NUMERIC_CHECK);
