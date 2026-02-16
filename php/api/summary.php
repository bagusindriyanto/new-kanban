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
    $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : null;
    $to_date = isset($_GET['to_date']) ? $_GET['to_date'] : null;
    $pic_id = isset($_GET['pic_id']) ? $_GET['pic_id'] : null;

    if (!$pic_id || $pic_id === 'all') {
      echo json_encode([
        "status" => "success",
        "filter" => [
          "from_date" => $from_date,
          "to_date" => $to_date,
          "pic_id" => $pic_id,
        ],
        "summary" => [
          "todo_count" => 0,
          "on_progress_count" => 0,
          "done_count" => 0,
          "archived_count" => 0,
          "total_count" => 0,
          "total_activity_minutes" => 0,
          "total_working_minutes" => 0,
          "percentage" => 0
        ],
        "table_summary" => [],
        "chart_summary" => [],
      ], JSON_NUMERIC_CHECK);
      die();
    }

    $sql_summary = "SELECT
        COUNT(CASE WHEN status = 'on progress' THEN 1 END) AS on_progress_count,
        COUNT(CASE WHEN status = 'done' THEN 1 END) AS done_count,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) AS archived_count,
        SUM(
          CASE
            WHEN status = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
            WHEN status = 'done' OR status = 'archived' THEN minute_activity
            ELSE 0
          END
        ) AS total_activity_minutes
        FROM tasks
        WHERE 1=1";

    $sql_todo_summary = "SELECT COUNT(id) AS todo_count FROM tasks WHERE status = 'todo'";

    $sql_working_summary = "SELECT SUM(working_minute) AS total_working_minutes FROM work_time WHERE 1=1";

    $sql_table_summary = "SELECT content,
      SUM(
        CASE
          WHEN status = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
          WHEN status = 'done' OR status = 'archived' THEN minute_activity
          ELSE 0
        END
      ) AS total_minutes,
      COUNT(id) AS activity_count,
      AVG(
        CASE
          WHEN status = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
          WHEN status = 'done' OR status = 'archived' THEN minute_activity
          ELSE NULL
        END
      ) AS avg_minutes
      FROM tasks
      WHERE 1=1";

    $sql_chart_summary = "WITH Rekap_A AS (
      SELECT 
          DATE(t.timestamp_progress) AS tgl, -- Konversi timestamp ke date
          t.pic_id,
          SUM(
              CASE
                  WHEN t.status = 'on progress' THEN TIMESTAMPDIFF(MINUTE, t.timestamp_progress, NOW())
                  WHEN t.status IN ('done', 'archived') THEN t.minute_activity
                  ELSE 0
              END
          ) AS total_activity_minutes
      FROM tasks t
      WHERE t.pic_id = :pic_id
      GROUP BY DATE(t.timestamp_progress), t.pic_id
      )

      SELECT 
          A.tgl AS date,
          A.total_activity_minutes AS activity_minute,
          IFNULL(B.working_minute, 0) AS working_minute
      FROM Rekap_A A
      LEFT JOIN work_time B 
          ON A.tgl = DATE(B.date) 
          AND A.pic_id = B.pic_id
      WHERE 1=1";

    $params = [];
    $todo_params = [];
    if ($from_date && $to_date) {
      $params[':from_date'] = $from_date . ' 00:00:00';
      $params[':to_date'] = $to_date . ' 23:59:59';
      $sql_summary .= " AND timestamp_progress BETWEEN :from_date AND :to_date";
      $sql_working_summary .= " AND date BETWEEN :from_date AND :to_date";
      $sql_table_summary .= " AND timestamp_progress BETWEEN :from_date AND :to_date";
      $sql_chart_summary .= " AND A.tgl BETWEEN :from_date AND :to_date";
    }

    $params[':pic_id'] = $pic_id;
    $todo_params[':pic_id'] = $pic_id;
    $sql_summary .= " AND pic_id = :pic_id";
    $sql_todo_summary .= " AND pic_id = :pic_id";
    $sql_working_summary .= " AND pic_id = :pic_id";
    $sql_table_summary .= " AND pic_id = :pic_id";
    $sql_chart_summary .= " ORDER BY A.tgl";

    $sql_table_summary .= " AND status <> 'todo' GROUP BY content";

    $stmt = $pdo->prepare($sql_summary);
    $stmt->execute($params);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt_todo = $pdo->prepare($sql_todo_summary);
    $stmt_todo->execute($todo_params);
    $todo_summary = $stmt_todo->fetch(PDO::FETCH_ASSOC);

    $stmt_working = $pdo->prepare($sql_working_summary);
    $stmt_working->execute($params);
    $working_summary = $stmt_working->fetch(PDO::FETCH_ASSOC);

    $stmt_table = $pdo->prepare($sql_table_summary);
    $stmt_table->execute($params);
    $table_summary = $stmt_table->fetchAll(PDO::FETCH_ASSOC);

    $stmt_chart = $pdo->prepare($sql_chart_summary);
    $stmt_chart->execute($params);
    $chart_summary = $stmt_chart->fetchAll(PDO::FETCH_ASSOC);

    $updated_summary = [
      "todo_count" => $todo_summary['todo_count'] ?? 0,
      "total_count" => ($summary['on_progress_count'] ?? 0) + ($summary['done_count'] ?? 0) + ($summary['archived_count'] ?? 0) + ($todo_summary['todo_count'] ?? 0),
      "total_working_minutes" => $working_summary['total_working_minutes'] ?? 0,
      "percentage" => $working_summary['total_working_minutes'] > 0 ? $summary['total_activity_minutes'] / $working_summary['total_working_minutes'] : 0
    ];

    echo json_encode([
      "status" => "success",
      "filter" => [
        "from_date" => $from_date,
        "to_date" => $to_date,
        "pic_id" => $pic_id
      ],
      "summary" => array_merge($summary, $updated_summary),
      "table_summary" => $table_summary,
      "chart_summary" => $chart_summary,
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
