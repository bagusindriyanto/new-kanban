<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "kanban_app";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  http_response_code(500);
  // die("Connection failed: " . $e->getMessage());
  echo json_encode([
    "status" => "error",
    "message" => "Gagal terhubung ke database.",
    "error_detail" => $e->getMessage(),
  ]);
  exit();
}
