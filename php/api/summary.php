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

  default:
    echo json_encode(["message" => "Invalid request method"]);
    break;
}

function handleGet($pdo)
{
  try {
    $sql = "SELECT a.pic_id,
              a.date
              ,COALESCE(b.todo_count, 0) AS todo_count
              ,a.on_progress_count
              ,a.done_count
              ,a.archived_count
              ,a.activity_duration
              ,a.working_minute
            FROM
            (SELECT t.pic_id
              ,t.tanggal AS date
              ,SUM(CASE 
                  WHEN t.STATUS = 'on progress'
                    THEN t.task_count
                  ELSE 0
                  END) AS on_progress_count
              ,SUM(CASE 
                  WHEN t.STATUS = 'done'
                    THEN t.task_count
                  ELSE 0
                  END) AS done_count
              ,SUM(CASE 
                  WHEN t.STATUS = 'archived'
                    THEN t.task_count
                  ELSE 0
                  END) AS archived_count
              ,SUM(CASE 
                  WHEN t.STATUS = 'done'
                    OR t.STATUS = 'archived'
                    THEN t.duration
                  ELSE 0
                  END) AS activity_duration
              ,w.working_minute
            FROM (
              SELECT pic_id
                ,DATE (timestamp_progress) AS tanggal
                ,STATUS
                ,COUNT(*) AS task_count
                ,SUM(minute_activity) AS duration
              FROM tasks
              GROUP BY pic_id
                ,DATE (timestamp_progress)
                ,STATUS
              ) t
            LEFT JOIN work_time w ON t.pic_id = w.pic_id
              AND t.tanggal = w.date
            GROUP BY t.pic_id
              ,t.tanggal
              ,w.working_minute
            ORDER BY t.pic_id
              ,t.tanggal
            ) a
            LEFT JOIN (SELECT pic_id, COUNT(id) AS todo_count FROM tasks WHERE STATUS = 'todo' GROUP BY pic_id) b ON a.pic_id = b.pic_id
            WHERE a.date IS NOT NULL;
            ";
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
