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
    $sql = "SELECT t.pic_id, t.tanggal AS date, SUM(CASE WHEN t.status = 'todo' THEN t.task_count ELSE 0 END) AS todo_count, SUM(CASE WHEN t.status = 'on progress' THEN t.task_count ELSE 0 END) AS on_progress_count, SUM(CASE WHEN t.status = 'done' THEN t.task_count ELSE 0 END) AS done_count, SUM(CASE WHEN t.status = 'done' THEN t.duration ELSE 0 END) AS activity_duration, SUM(CASE WHEN t.status = 'archived' THEN t.task_count ELSE 0 END) AS archived_count, w.working_minute FROM ( SELECT pic_id, DATE(timestamp_done) AS tanggal, status, COUNT(*) AS task_count, SUM(minute_activity) AS duration FROM tasks GROUP BY pic_id, DATE(timestamp_done), status ) t LEFT JOIN work_time w ON t.pic_id = w.pic_id AND t.tanggal = w.date GROUP BY t.pic_id, t.tanggal, w.working_minute ORDER BY t.pic_id, t.tanggal";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result, JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch summary: ' . $e->getMessage()]);
  }
  exit;
}
