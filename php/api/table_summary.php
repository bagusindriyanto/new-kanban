<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
  case 'GET':
    handleGet($pdo);
    break;

  default:
    echo json_encode(["message" => "Invalid request method"]);
    break;
}

function handleGet($pdo)
{
  try {
    $sql = "SELECT t.date, t.pic_id, p.name, t.content, t.total_minutes, t.activity_count, t.avg_minutes FROM (SELECT DATE(timestamp_done) AS date, pic_id, content,  SUM(minute_activity) as total_minutes, COUNT(content) as activity_count, AVG(minute_activity) as avg_minutes from tasks GROUP BY date, content, pic_id) t LEFT JOIN pics p ON t.pic_id = p.id ORDER BY t.date, t.pic_id, t.content";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result, JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch table summary: ' . $e->getMessage()]);
  }
  exit;
}
