<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include "db.php";

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  case "GET":
    handleGet($pdo);
    break;

  default:
    echo json_encode(["message" => "Invalid request method"]);
    break;
}

function handleGet($pdo)
{
  try {
    $start_date = isset($_GET['start_date']) ? $_GET['start_date'] : null;
    $end_date = isset($_GET['end_date']) ? $_GET['end_date'] : null;
    $pic_id = isset($_GET['pic_id']) ? $_GET['pic_id'] : null;

    $sql_summary = "SELECT COUNT(id) as total_count,
        COUNT(CASE WHEN STATUS = 'todo' THEN 1 END) AS todo_count,
        COUNT(CASE WHEN STATUS = 'on progress' THEN 1 END) AS on_progress_count,
        COUNT(CASE WHEN STATUS = 'done' THEN 1 END) AS done_count,
        COUNT(CASE WHEN STATUS = 'archived' THEN 1 END) AS archived_count,
        SUM(
          CASE
            WHEN STATUS = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
            WHEN STATUS = 'done' OR STATUS = 'archived' THEN minute_activity
            ELSE 0
          END
        ) AS total_activity_minutes
        FROM tasks
        WHERE 1=1";

    $sql_working_summary = "SELECT SUM(working_minute) AS total_working_minutes FROM work_time WHERE 1=1";

    $sql_table_summary = "SELECT content,
      SUM(
        CASE
          WHEN STATUS = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
          WHEN STATUS = 'done' OR STATUS = 'archived' THEN minute_activity
          ELSE 0
        END
      ) AS total_minutes,
      COUNT(*) AS activity_count,
      AVG(
        CASE
          WHEN STATUS = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
          WHEN STATUS = 'done' OR STATUS = 'archived' THEN minute_activity
          ELSE NULL
        END
      ) AS avg_minutes
      FROM tasks
      WHERE 1=1";

    $params = [];
    if ($start_date && $end_date) {
      $params[':start_date'] = $start_date . ' 00:00:00';
      $params[':end_date'] = $end_date . ' 23:59:59';
      $sql_summary .= " AND timestamp_progress BETWEEN :start_date AND :end_date";
      $sql_working_summary .= " AND date BETWEEN :start_date AND :end_date";
      $sql_table_summary .= " AND timestamp_progress BETWEEN :start_date AND :end_date";
    }

    if ($pic_id && $pic_id !== 'all') {
      $params[':pic_id'] = $pic_id;
      $sql_summary .= " AND pic_id = :pic_id";
      $sql_working_summary .= " AND pic_id = :pic_id";
      $sql_table_summary .= " AND pic_id = :pic_id";
    }

    $sql_table_summary .= " AND status <> 'todo' GROUP BY content";

    $stmt = $pdo->prepare($sql_summary);
    $stmt->execute($params);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt_working = $pdo->prepare($sql_working_summary);
    $stmt_working->execute($params);
    $working_summary = $stmt_working->fetch(PDO::FETCH_ASSOC);

    $stmt_table = $pdo->prepare($sql_table_summary);
    $stmt_table->execute($params);
    $table_summary = $stmt_table->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      "status" => "success",
      "filter" => [
        "start_date" => $start_date,
        "end_date" => $end_date,
        "pic_id" => $pic_id
      ],
      "summary" => [
        ...$summary,
        "total_working_minutes" => $working_summary['total_working_minutes'] ?? 0,
        "percentage" => $working_summary['total_working_minutes'] > 0 ? $summary['total_activity_minutes'] / $working_summary['total_working_minutes'] : 0
      ],
      "table_summary" => $table_summary
    ], JSON_NUMERIC_CHECK);
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
