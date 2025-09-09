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

  case 'DELETE':
    handleDelete($pdo);
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
    echo json_encode(["id" => $pdo->lastInsertId(), "content" => $content, "pic_id" => $pic_id, "detail" => $detail, "status" => $status, 'timestamp_todo' => $timestamp_todo, 'timestamp_progress' => $timestamp_progress, 'timestamp_done' => $timestamp_done, 'timestamp_archived' => $timestamp_archived, 'minute_pause' => $minute_pause, 'minute_activity' => $minute_activity, 'pause_time' => $pause_time], JSON_NUMERIC_CHECK);
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
    $content = $input['content'] ?? "";
    $pic_id = $input['pic_id'] ?? null;
    $detail = $input['detail'] ?? "";
    $status = $input['status'] ?? null;
    $timestamp_todo = $input['timestamp_todo'] ?? null;
    $timestamp_progress = $input['timestamp_progress'] ?? null;
    $timestamp_done = $input['timestamp_done'] ?? null;
    $timestamp_archived = $input['timestamp_archived'] ?? null;
    $minute_pause = $input['minute_pause'] ?? 0;
    $minute_activity = $input['minute_activity'] ?? 0;
    $pause_time = $input['pause_time'] ?? null;

    $fields = ['content = ?', 'pic_id = ?', 'detail = ?', 'status = ?', 'timestamp_todo = ?', 'timestamp_progress = ?', 'timestamp_done = ?', 'timestamp_archived = ?', 'minute_pause = ?', 'minute_activity = ?', 'pause_time = ?'];
    $params = [$content, $pic_id, $detail, $status, $timestamp_todo, $timestamp_progress, $timestamp_done, $timestamp_archived, $minute_pause, $minute_activity, $pause_time, $id];
    $sql = "UPDATE tasks SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
      // ambil data terbaru setelah update
      $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = :id");
      $stmt->execute([":id" => $id]);
      $data = $stmt->fetch(PDO::FETCH_ASSOC);

      // daftar kolom datetime yang mau diubah
      $timestampFields = ['timestamp_todo', 'timestamp_progress', 'timestamp_done', 'timestamp_archived', 'created_at', 'pause_time'];
      foreach ($timestampFields as $field) {
        if (!empty($data[$field])) {
          $utcDate = new DateTime($data[$field], new DateTimeZone('UTC'));
          $data[$field] = $utcDate->format('c');
        }
      }
      http_response_code(201);
      echo json_encode($data, JSON_NUMERIC_CHECK);
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'Task not found or no changes made']);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update Task: ' . $e->getMessage()]);
  }
  exit;
}

// fungsi untuk menangani request DELETE
function handleDelete($pdo)
{
  // validasi input
  if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID is required"]);
    exit;
  }

  try {
    $id = intval($_GET['id']);

    // hapus data yang dipilih
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
    $stmt->execute([":id" => $id]);
    if ($stmt->rowCount() > 0) {
      echo json_encode(["message" => "Task has been deleted", "id" => $id], JSON_NUMERIC_CHECK);
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'Task not found or no changes made']);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete Task: ' . $e->getMessage()]);
  }
  exit;
}
