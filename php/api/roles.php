<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case "GET":
    handleGet($pdo);
    break;

  case "POST":
    handlePost($pdo, $input);
    break;

  default:
    echo json_encode(["message" => "Invalid request method."]);
    break;
}

function handleGet($pdo)
{
  try {
    $sql = "SELECT * FROM roles WHERE name <> 'Admin' ORDER BY level DESC";
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

function handlePost($pdo, $input)
{
  if (!isset($input["name"]) || !isset($input["level"])) {
    http_response_code(400);
    echo json_encode(["message" => "Nama dan level diperlukan."]);
    exit();
  }
  try {
    $sql = "INSERT INTO roles (name, level) VALUES (:name, :level)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":name" => $input["name"], ":level" => $input["level"]]);
    http_response_code(201);
    echo json_encode(
      ["id" => $pdo->lastInsertId(), "name" => $input["name"], "level" => $input["level"]],
      JSON_NUMERIC_CHECK,
    );
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal menambahkan jabatan.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
