<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include "db.php";

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
    $sql = "SELECT * FROM activities ORDER BY created_at DESC";
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
  if (!isset($input["activity"])) {
    http_response_code(400);
    echo json_encode(["message" => "Nama activity diperlukan."]);
    exit();
  }
  try {
    $sql = "INSERT INTO activities (name) VALUES (:name)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":name" => $input["activity"]]);
    http_response_code(201);
    echo json_encode(
      ["id" => $pdo->lastInsertId(), "activity" => $input["activity"]],
      JSON_NUMERIC_CHECK,
    );
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Gagal menambahkan activity.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
