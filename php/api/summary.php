<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include "db.php";

// Shared SQL fragment for calculating activity minutes — single source of truth
const SQL_ACTIVITY_MINUTES = "
    CASE
        WHEN status = 'on progress' THEN TIMESTAMPDIFF(MINUTE, timestamp_progress, NOW())
        WHEN status IN ('done', 'archived') THEN minute_activity
        ELSE 0
    END";

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  case "GET":
    handleGet($pdo);
    break;

  default:
    echo json_encode(["message" => "Invalid request method"]);
    break;
}

// ─── Filter Builders ───────────────────────────────────────────────

/**
 * Build WHERE clause + params for the tasks table.
 */
function buildWhereClause(array $filters): array
{
  $conditions = [];
  $params = [];

  if (!empty($filters['from_date']) && !empty($filters['to_date'])) {
    $conditions[] = "timestamp_progress BETWEEN :from_date AND :to_date";
    $params[':from_date'] = $filters['from_date'] . ' 00:00:00';
    $params[':to_date']   = $filters['to_date'] . ' 23:59:59';
  }

  if (!empty($filters['pic_id'])) {
    $conditions[] = "pic_id = :pic_id";
    $params[':pic_id'] = $filters['pic_id'];
  }

  $where = $conditions ? ' WHERE ' . implode(' AND ', $conditions) : '';
  return [$where, $params];
}

/**
 * Build WHERE clause + params for the work_time table.
 * Uses `date` column instead of `timestamp_progress`.
 */
function buildWorkTimeWhereClause(array $filters): array
{
  $conditions = [];
  $params = [];

  if (!empty($filters['from_date']) && !empty($filters['to_date'])) {
    $conditions[] = "date BETWEEN :from_date AND :to_date";
    $params[':from_date'] = $filters['from_date'] . ' 00:00:00';
    $params[':to_date']   = $filters['to_date'] . ' 23:59:59';
  }

  if (!empty($filters['pic_id'])) {
    $conditions[] = "pic_id = :pic_id";
    $params[':pic_id'] = $filters['pic_id'];
  }

  $where = $conditions ? ' WHERE ' . implode(' AND ', $conditions) : '';
  return [$where, $params];
}

// ─── Query Functions ───────────────────────────────────────────────

function getSummary(PDO $pdo, string $where, array $params): array
{
  $sql = "SELECT
      COUNT(CASE WHEN status = 'on progress' THEN 1 END) AS on_progress_count,
      COUNT(CASE WHEN status = 'done' THEN 1 END) AS done_count,
      COUNT(CASE WHEN status = 'archived' THEN 1 END) AS archived_count,
      SUM(" . SQL_ACTIVITY_MINUTES . ") AS total_activity_minutes
      FROM tasks $where";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getTodoCount(PDO $pdo, string $picId): array
{
  $sql = "SELECT COUNT(id) AS todo_count FROM tasks WHERE status = 'todo' AND pic_id = :pic_id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':pic_id' => $picId]);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getWorkingSummary(PDO $pdo, string $where, array $params): array
{
  $sql = "SELECT SUM(working_minute) AS total_working_minutes FROM work_time $where";
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getTableSummary(PDO $pdo, string $where, array $params): array
{
  // Append extra condition: exclude 'todo' tasks and group by content
  $extra = $where
    ? " AND status <> 'todo' GROUP BY content"
    : " WHERE status <> 'todo' GROUP BY content";

  $sql = "SELECT content,
      SUM(" . SQL_ACTIVITY_MINUTES . ") AS total_minutes,
      COUNT(id) AS activity_count,
      AVG(" . SQL_ACTIVITY_MINUTES . ") AS avg_minutes
      FROM tasks $where $extra";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getChartSummary(PDO $pdo, string $picId, ?string $fromDate, ?string $toDate): array
{
  $dateFilter = '';
  $params = [':pic_id' => $picId];

  if ($fromDate && $toDate) {
    $dateFilter = " AND A.tgl BETWEEN :from_date AND :to_date";
    $params[':from_date'] = $fromDate . ' 00:00:00';
    $params[':to_date']   = $toDate . ' 23:59:59';
  }

  $sql = "WITH Rekap_A AS (
      SELECT
          DATE(t.timestamp_progress) AS tgl,
          t.pic_id,
          SUM(" . SQL_ACTIVITY_MINUTES . ") AS total_activity_minutes
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
      WHERE 1=1 $dateFilter
      ORDER BY A.tgl";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ─── Response Helpers ──────────────────────────────────────────────

function emptyResponse(?string $fromDate, ?string $toDate, ?string $picId): array
{
  return [
    "status" => "success",
    "filter" => [
      "from_date" => $fromDate,
      "to_date" => $toDate,
      "pic_id" => $picId,
    ],
    "summary" => [
      "todo_count" => 0,
      "on_progress_count" => 0,
      "done_count" => 0,
      "archived_count" => 0,
      "total_count" => 0,
      "total_activity_minutes" => 0,
      "total_working_minutes" => 0,
      "percentage" => 0,
    ],
    "table_summary" => [],
    "chart_summary" => [],
  ];
}

function mergeSummary(array $summary, array $todoSummary, array $workingSummary): array
{
  $todoCount = $todoSummary['todo_count'] ?? 0;
  $totalWorkingMinutes = $workingSummary['total_working_minutes'] ?? 0;
  $totalActivityMinutes = $summary['total_activity_minutes'] ?? 0;

  return array_merge($summary, [
    "todo_count" => $todoCount,
    "total_count" => ($summary['on_progress_count'] ?? 0)
                   + ($summary['done_count'] ?? 0)
                   + ($summary['archived_count'] ?? 0)
                   + $todoCount,
    "total_working_minutes" => $totalWorkingMinutes,
    "percentage" => $totalWorkingMinutes > 0
      ? $totalActivityMinutes / $totalWorkingMinutes
      : 0,
  ]);
}

// ─── Main Handler ──────────────────────────────────────────────────

function handleGet(PDO $pdo): void
{
  try {
    $from_date = $_GET['from_date'] ?? null;
    $to_date   = $_GET['to_date']   ?? null;
    $pic_id    = $_GET['pic_id']    ?? null;

    if (!$pic_id || $pic_id === 'all') {
      echo json_encode(emptyResponse($from_date, $to_date, $pic_id), JSON_NUMERIC_CHECK);
      return;
    }

    $filters = [
      'from_date' => $from_date,
      'to_date'   => $to_date,
      'pic_id'    => $pic_id,
    ];

    [$where, $params]         = buildWhereClause($filters);
    [$wtWhere, $wtParams]     = buildWorkTimeWhereClause($filters);

    $summary        = getSummary($pdo, $where, $params);
    $todoSummary    = getTodoCount($pdo, $pic_id);
    $workingSummary = getWorkingSummary($pdo, $wtWhere, $wtParams);
    $tableSummary   = getTableSummary($pdo, $where, $params);
    $chartSummary   = getChartSummary($pdo, $pic_id, $from_date, $to_date);

    echo json_encode([
      "status"        => "success",
      "filter"        => $filters,
      "summary"       => mergeSummary($summary, $todoSummary, $workingSummary),
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
