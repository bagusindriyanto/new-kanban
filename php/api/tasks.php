<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// menangani request untuk setiap http method
switch ($method) {
  case 'GET':
    handleGet($pdo);
    break;

  case 'POST':
    handlePost($pdo, $input);
    break;

  case 'PATCH':
    handlePatch($pdo, $input);
    break;

  default:
    echo json_encode(["message" => "Invalid request method"]);
    break;
}

// fungsi untuk menangani request GET
function handleGet($pdo)
{
  try {
    $sql = "SELECT * FROM tasks ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // konversi semua field datetime/timestamp dari GMT+7 ke UTC dengan format ISO 8601
    // foreach ($result as $row) {
    //   foreach ($row as $key => $value) {
    //     // hanya proses kalau $value bukan null DAN bisa diparse sebagai datetime
    //     if ($value !== null && strtotime($value) !== false) {
    //       // cek apakah stringnya match format datetime/timestamp MySQL
    //       if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $value)) {
    //         $dt = new DateTime($value, new DateTimeZone('Asia/Jakarta')); // GMT+7
    //         $dt->setTimezone(new DateTimeZone('UTC')); // ubah ke UTC
    //         $row[$key] = $dt->format('c'); // ISO 8601 dengan "Z"
    //       }
    //     }
    //   }
    // }
    // unset($row); // hapus reference
    $data = array_map(function ($row) {
      $timestamp_fields = ['timestamp_todo', 'timestamp_progress', 'timestamp_done', 'timestamp_archived', 'created_at', 'pause_time'];

      foreach ($timestamp_fields as $field) {
        if (!empty($row[$field])) {
          $utcDate = new DateTime($row[$field], new DateTimeZone('UTC'));
          $row[$field] = $utcDate->format('c');
        }
      }
      return $row;
    }, $rows);

    echo json_encode($data, JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch Tasks: ' . $e->getMessage()]);
  }
  exit;
}

// fungsi untuk menangani request POST
function handlePost($pdo, $input)
{
  // validasi input
  if (!isset($input['content'])) {
    http_response_code(400);
    echo json_encode(["message" => "Content is required"]);
    exit;
  }
  try {
    $content = $input['content'];
    $pic_id = $input['pic_id'] ?? null;
    $detail = $input['detail'] ?? "";
    $status = $input['status'] ?? "todo";
    $timestamp_todo = $input['timestamp_todo'];
    $timestamp_progress = null;
    $timestamp_done = null;
    $timestamp_archived = null;
    $minute_pause = 0;
    $minute_activity = 0;
    $pause_time = null;

    $sql = "INSERT INTO tasks (content, pic_id, detail, status, timestamp_todo, timestamp_progress, timestamp_done, timestamp_archived, minute_pause, minute_activity, pause_time) VALUES (:content, :pic_id, :detail, :status, :timestamp_todo, :timestamp_progress, :timestamp_done, :timestamp_archived, :minute_pause, :minute_activity, :pause_time)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':content' => $content, ':pic_id' => $pic_id, ':detail' => $detail, ':status' => $status, ':timestamp_todo' => $timestamp_todo, ':timestamp_progress' => $timestamp_progress, ':timestamp_done' => $timestamp_done, ':timestamp_archived' => $timestamp_archived, ':minute_pause' => $minute_pause, ':minute_activity' => $minute_activity, ':pause_time' => $pause_time]);
    http_response_code(201);
    echo json_encode(["id" => $pdo->lastInsertId(), "content" => $input['content'], "pic_id" => $input['pic_id'], "detail" => $input['detail'], "status" => $input['status']], JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add Task: ' . $e->getMessage()]);
  }
}

// fungsi untuk menangani request PATCH
function handlePatch($pdo, $input)
{
  // validasi input
  if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID is required"]);
    exit;
  }

  try {
    $id = intval($_GET['id']);
    $status = $input['status'] ?? null;
    $timestamp_todo = $input['timestamp_todo'] ?? null;
    $timestamp_progress = $input['timestamp_progress'] ?? null;
    $timestamp_done = $input['timestamp_done'] ?? null;
    $timestamp_archived = $input['timestamp_archived'] ?? null;
    $minute_pause = $input['minute_pause'] ?? 0;
    $minute_activity = $input['minute_activity'] ?? 0;
    $pause_time = $input['pause_time'] ?? null;

    $fields = ['status = ?', 'timestamp_todo = ?', 'timestamp_progress = ?', 'timestamp_done = ?', 'timestamp_archived = ?', 'minute_pause = ?', 'minute_activity = ?', 'pause_time = ?'];
    $params = [$status, $timestamp_todo, $timestamp_progress, $timestamp_done, $timestamp_archived, $minute_pause, $minute_activity, $pause_time, $id];
    $sql = "UPDATE tasks SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
      echo json_encode(['message' => 'Task updated successfully', 'id' => $id], JSON_NUMERIC_CHECK);
    } else {
      echo json_encode(['error' => 'Task not found or no changes made']);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update Task: ' . $e->getMessage()]);
  }
  exit;
}
