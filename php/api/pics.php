<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "auth.php";
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case "GET":
    handleGet($pdo);
    break;

  default:
    echo json_encode(["message" => "Invalid request method."]);
    break;
}

function handleGet($pdo)
{
  try {
    $sql = "SELECT p.id as id, p.full_name as full_name, p.name as name, d.name as division, r.name as role, p.nik as nik, r.level as level FROM pics p JOIN divisions d ON p.division_id = d.id JOIN roles r ON p.role_id = r.id WHERE r.name != 'Admin' ORDER BY name ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result, JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal mengambil data.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
