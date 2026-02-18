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

// ─── Helper: reusable SQL expression for activity minutes ───
function activityMinutesExpr(string $alias = ''): string
{
  $prefix = $alias ? "{$alias}." : '';
  return "
    CASE
      WHEN {$prefix}status = 'on progress'
        THEN TIMESTAMPDIFF(MINUTE, {$prefix}timestamp_progress, NOW()) - {$prefix}minute_pause
      WHEN {$prefix}status IN ('done', 'archived')
        THEN {$prefix}minute_activity
      ELSE 0
    END";
}

// ─── Helper: build WHERE clause + params from filters ───
function buildFilters(array $get, string $dateCol, string $picCol): array
{
  $conditions = [];
  $params     = [];

  $from_date = $get['from_date'] ?? null;
  $to_date   = $get['to_date']   ?? null;
  $pic_id    = $get['pic_id']    ?? null;

  if ($from_date && $to_date) {
    $conditions[]          = "{$dateCol} BETWEEN :from_date AND :to_date";
    $params[':from_date']  = $from_date . ' 00:00:00';
    $params[':to_date']    = $to_date   . ' 23:59:59';
  }

  if ($pic_id) {
    $conditions[]        = "{$picCol} = :pic_id";
    $params[':pic_id']   = $pic_id;
  }

  $where = $conditions
    ? 'WHERE ' . implode(' AND ', $conditions)
    : '';

  return [$where, $params];
}

// ─── Helper: prepare → execute → return result ───
function query(PDO $pdo, string $sql, array $params, bool $fetchAll = false)
{
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  return $fetchAll
    ? $stmt->fetchAll(PDO::FETCH_ASSOC)
    : $stmt->fetch(PDO::FETCH_ASSOC);
}

// ─── Individual query builders ──────────────────────────────

function querySummary(PDO $pdo, string $where, array $params): array
{
  $activityExpr = activityMinutesExpr();
  $sql = "
    SELECT
      COUNT(CASE WHEN status = 'on progress' THEN 1 END) AS on_progress_count,
      COUNT(CASE WHEN status = 'done'        THEN 1 END) AS done_count,
      COUNT(CASE WHEN status = 'archived'    THEN 1 END) AS archived_count,
      SUM({$activityExpr}) AS total_activity_minutes
    FROM tasks
    {$where}
  ";
  return query($pdo, $sql, $params) ?: [];
}

function queryTodoCount(PDO $pdo, string $picId): array
{
  $sql = "
    SELECT COUNT(id) AS todo_count
    FROM tasks
    WHERE status = 'todo' AND pic_id = :pic_id
  ";
  return query($pdo, $sql, [':pic_id' => $picId]) ?: [];
}

function queryWorkingMinutes(PDO $pdo, string $where, array $params): array
{
  $sql = "
    SELECT SUM(working_minute) AS total_working_minutes
    FROM work_time
    {$where}
  ";
  return query($pdo, $sql, $params) ?: [];
}

function queryTableSummary(PDO $pdo, string $where, array $params): array
{
  $activityExpr = activityMinutesExpr();
  $statusFilter = $where
    ? "{$where} AND status <> 'todo'"
    : "WHERE status <> 'todo'";

  $sql = "
    SELECT
      content,
      SUM({$activityExpr})  AS total_minutes,
      COUNT(id)              AS activity_count,
      AVG(
        CASE
          WHEN status = 'on progress'
            THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW()) - minute_pause
          WHEN status IN ('done', 'archived')
            THEN minute_activity
          ELSE NULL
        END
      ) AS avg_minutes
    FROM tasks
    {$statusFilter}
    GROUP BY content
  ";
  return query($pdo, $sql, $params, true);
}

function queryChartSummary(PDO $pdo, array $params): array
{
  $activityExpr = activityMinutesExpr('t');

  // Date range condition for the outer WHERE
  $outerConditions = [];
  if (isset($params[':from_date'], $params[':to_date'])) {
    $outerConditions[] = "A.tgl BETWEEN :from_date AND :to_date";
  }
  $outerWhere = $outerConditions
    ? 'WHERE ' . implode(' AND ', $outerConditions)
    : '';

  $sql = "
    WITH Rekap_A AS (
      SELECT
        DATE(t.timestamp_progress) AS tgl,
        t.pic_id,
        SUM({$activityExpr}) AS total_activity_minutes
      FROM tasks t
      WHERE t.pic_id = :pic_id
      GROUP BY DATE(t.timestamp_progress), t.pic_id
    )
    SELECT
      A.tgl                          AS date,
      A.total_activity_minutes       AS activity_minute,
      IFNULL(B.working_minute, 0)    AS working_minute
    FROM Rekap_A A
    LEFT JOIN work_time B
      ON A.tgl = DATE(B.date)
      AND A.pic_id = B.pic_id
    {$outerWhere}
    ORDER BY A.tgl
  ";
  return query($pdo, $sql, $params, true);
}

// ─── Main handler ───────────────────────────────────────────

function handleGet(PDO $pdo): void
{
  try {
    $from_date = $_GET['from_date'] ?? null;
    $to_date   = $_GET['to_date']   ?? null;
    $pic_id    = $_GET['pic_id']    ?? null;

    // Early return for missing / "all" pic_id
    if (!$pic_id || $pic_id === 'all') {
      echo json_encode([
        "status"  => "success",
        "filter"  => compact('from_date', 'to_date', 'pic_id'),
        "summary" => [
          "todo_count"             => 0,
          "on_progress_count"      => 0,
          "done_count"             => 0,
          "archived_count"         => 0,
          "total_count"            => 0,
          "total_activity_minutes" => 0,
          "total_working_minutes"  => 0,
          "percentage"             => 0,
        ],
        "table_summary" => [],
        "chart_summary" => [],
      ], JSON_NUMERIC_CHECK);
      die();
    }

    // Build filters for each table
    [$taskWhere,  $taskParams]  = buildFilters($_GET, 'timestamp_progress', 'pic_id');
    [$workWhere,  $workParams]  = buildFilters($_GET, 'date',               'pic_id');
    [$chartParams]              = [array_merge($taskParams)]; // chart reuses task params

    // Run queries
    $summary         = querySummary($pdo, $taskWhere, $taskParams);
    $todoSummary     = queryTodoCount($pdo, $pic_id);
    $workingSummary  = queryWorkingMinutes($pdo, $workWhere, $workParams);
    $tableSummary    = queryTableSummary($pdo, $taskWhere, $taskParams);
    $chartSummary    = queryChartSummary($pdo, $chartParams);

    // Derived values
    $todoCount           = $todoSummary['todo_count']              ?? 0;
    $totalActivityMin    = $summary['total_activity_minutes']      ?? 0;
    $totalWorkingMin     = $workingSummary['total_working_minutes'] ?? 0;

    $totalCount = ($summary['on_progress_count'] ?? 0)
      + ($summary['done_count']        ?? 0)
      + ($summary['archived_count']    ?? 0)
      + $todoCount;

    $percentage = $totalWorkingMin > 0
      ? $totalActivityMin / $totalWorkingMin
      : 0;

    echo json_encode([
      "status"        => "success",
      "filter"        => compact('from_date', 'to_date', 'pic_id'),
      "summary"       => array_merge($summary, [
        "todo_count"            => $todoCount,
        "total_count"           => $totalCount,
        "total_working_minutes" => $totalWorkingMin,
        "percentage"            => $percentage,
      ]),
      "table_summary" => $tableSummary,
      "chart_summary" => $chartSummary,
    ], JSON_NUMERIC_CHECK);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status"       => "error",
      "message"      => "Gagal mengambil data.",
      "error_detail" => $e->getMessage(),
    ]);
  }
  exit();
}
