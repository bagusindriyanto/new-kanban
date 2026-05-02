<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * SummaryController
 *
 * Provides dashboard summary data including task counts,
 * activity minutes, working minutes, table and chart data.
 */
class SummaryController extends BaseController
{
  /**
   * GET /summary
   *
   * Returns summary data with optional filters: pic_id, from_date, to_date.
   */
  public function index()
  {
    try {
      $fromDate = $this->request->query('from_date');
      $toDate   = $this->request->query('to_date');
      // $picId    = $this->request->query('pic_id');

      // Early return for missing / "all" pic_id
      // if (!$picId || $picId === 'all') {
      //     $this->json([
      //         'status'  => 'success',
      //         'filter'  => [
      //             'from_date' => $fromDate,
      //             'to_date'   => $toDate,
      //             'pic_id'    => $picId,
      //         ],
      //         'summary' => [
      //             'todo_count'             => 0,
      //             'on_progress_count'      => 0,
      //             'done_count'             => 0,
      //             'total_count'            => 0,
      //             'total_activity_minutes' => 0,
      //             'total_working_minutes'  => 0,
      //             'percentage'             => 0,
      //         ],
      //         'table_summary' => [],
      //         'chart_summary' => [],
      //     ]);
      // }

      // Build filters for each table
      list($taskWhere, $taskParams) = $this->buildFilters(
        $_GET,
        'timestamp_progress',
        // 'pic_id'
      );
      list($workWhere, $workParams) = $this->buildFilters(
        $_GET,
        'date',
        // 'pic_id'
      );
      $chartParams = array_merge($taskParams);

      // Run queries
      $summary        = $this->querySummary($taskWhere, $taskParams);
      $todoSummary    = $this->queryTodoCount();
      $workingSummary = $this->queryWorkingMinutes($workWhere, $workParams);
      $tableSummary   = $this->queryTableSummary($taskWhere, $taskParams);
      $chartSummary   = $this->queryChartSummary($chartParams);

      // Derived values
      $todoCount        = $todoSummary['todo_count'] ?? 0;
      $totalActivityMin = $summary['total_activity_minutes'] ?? 0;
      $totalWorkingMin  = $workingSummary['total_working_minutes'] ?? 0;

      $totalCount = ($summary['on_progress_count'] ?? 0)
        + ($summary['done_count'] ?? 0)
        + $todoCount;

      $percentage = $totalWorkingMin > 0
        ? $totalActivityMin / $totalWorkingMin
        : 0;

      $this->json([
        'status'        => 'success',
        'filter'        => [
          'from_date' => $fromDate,
          'to_date'   => $toDate,
          // 'pic_id'    => $picId,
        ],
        'summary'       => array_merge($summary, [
          'todo_count'            => $todoCount,
          'total_count'           => $totalCount,
          'total_working_minutes' => $totalWorkingMin,
          'percentage'            => $percentage,
        ]),
        'table_summary' => $tableSummary,
        'chart_summary' => $chartSummary,
      ]);
    } catch (PDOException $e) {
      $this->error('Gagal mengambil data.', 500, $e->getMessage());
    }
  }

    // ─── Helper: reusable SQL expression for activity minutes ───

  /**
   * @param string $alias Table alias
   * @return string
   */
  private function activityMinutesExpr($alias = '')
  {
    $prefix = $alias ? "{$alias}." : '';
    return "
            CASE
              WHEN {$prefix}status = 'on progress' THEN
                CASE
                  WHEN {$prefix}pause_time IS NULL THEN TIMESTAMPDIFF(MINUTE, {$prefix}timestamp_progress, NOW()) - {$prefix}minute_pause
                  ELSE TIMESTAMPDIFF(MINUTE, {$prefix}timestamp_progress, {$prefix}pause_time) - {$prefix}minute_pause
                END
              WHEN {$prefix}status = 'done' THEN
                {$prefix}minute_activity
              ELSE 0
            END";
  }

    // ─── Helper: build WHERE clause + params from filters ───

  /**
   * @param array  $get
   * @param string $dateCol
   * @return array [whereString, params]
   */
  private function buildFilters(array $get, $dateCol)
  {
    $conditions = [];
    $params     = [];

    $fromDate = $get['from_date'] ?? null;
    $toDate   = $get['to_date'] ?? null;
    // $picId    = $get['pic_id'] ?? null;

    if ($fromDate && !$toDate) {
      $conditions[]         = "{$dateCol} BETWEEN :from_date AND :to_date";
      $params[':from_date'] = $fromDate . ' 00:00:00';
      $params[':to_date']   = $fromDate . ' 23:59:59';
    } else if ($fromDate && $toDate) {
      $conditions[]         = "{$dateCol} BETWEEN :from_date AND :to_date";
      $params[':from_date'] = $fromDate . ' 00:00:00';
      $params[':to_date']   = $toDate . ' 23:59:59';
    }

    // if ($picId) {
    //     $conditions[]       = "{$picCol} = :pic_id";
    //     $params[':pic_id']  = $picId;
    // }

    $where = $conditions
      ? 'WHERE ' . implode(' AND ', $conditions)
      : '';

    return [$where, $params];
  }

    // ─── Helper: prepare → execute → return result ───

  /**
   * @param string $sql
   * @param array  $params
   * @param bool   $fetchAll
   * @return array|mixed
   */
  private function query($sql, array $params, $fetchAll = false)
  {
    $stmt = $this->db->prepare($sql);
    $stmt->execute($params);
    return $fetchAll
      ? $stmt->fetchAll(PDO::FETCH_ASSOC)
      : $stmt->fetch(PDO::FETCH_ASSOC);
  }

    // ─── Individual query builders ──────────────────────────────

  /**
   * @param string $where
   * @param array  $params
   * @return array
   */
  private function querySummary($where, array $params)
  {
    $activityExpr = $this->activityMinutesExpr();
    $sql = "
            SELECT
              COUNT(CASE WHEN status = 'on progress' THEN 1 END) AS on_progress_count,
              COUNT(CASE WHEN status = 'done'        THEN 1 END) AS done_count,
              SUM({$activityExpr}) AS total_activity_minutes
            FROM tasks
            {$where}
        ";
    $result = $this->query($sql, $params);
    return $result ?: [];
  }

  /**
   * @return array
   */
  private function queryTodoCount()
  {
    $sql = "
            SELECT COUNT(id) AS todo_count
            FROM tasks
            WHERE status = 'todo'
        ";
    $result = $this->query($sql, []);
    return $result ?: [];
  }

  /**
   * @param string $where
   * @param array  $params
   * @return array
   */
  private function queryWorkingMinutes($where, array $params)
  {
    $sql = "
            SELECT SUM(working_minute) AS total_working_minutes
            FROM work_time
            {$where}
        ";
    $result = $this->query($sql, $params);
    return $result ?: [];
  }

  /**
   * @param string $where
   * @param array  $params
   * @return array
   */
  private function queryTableSummary($where, array $params)
  {
    $activityExpr = $this->activityMinutesExpr("t");
    $statusFilter = $where
      ? "{$where} AND status <> 'todo'"
      : "WHERE status <> 'todo'";

    $sql = "
            SELECT
              t.content,
              p.name AS pic_name,
              SUM({$activityExpr})  AS total_minutes,
              COUNT(t.id)              AS activity_count,
              AVG(
                CASE
                  WHEN t.status = 'on progress' THEN
                    CASE
                      WHEN t.pause_time IS NULL THEN TIMESTAMPDIFF(MINUTE, t.timestamp_progress, NOW()) - t.minute_pause
                      ELSE TIMESTAMPDIFF(MINUTE, t.timestamp_progress, t.pause_time) - t.minute_pause
                    END
                  WHEN t.status = 'done' THEN
                    t.minute_activity
                  ELSE NULL
                END
              ) AS avg_minutes
            FROM tasks t
            LEFT JOIN pics p
            ON t.pic_id = p.id
            {$statusFilter}
            GROUP BY t.content, p.name
        ";
    return $this->query($sql, $params, true);
  }

  /**
   * @param array $params
   * @return array
   */
  private function queryChartSummary(array $params)
  {
    $activityExpr = $this->activityMinutesExpr('t');

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
              GROUP BY DATE(t.timestamp_progress), t.pic_id
            )
            SELECT
              A.pic_id,
              C.name,
              A.tgl                          AS date,
              A.total_activity_minutes       AS activity_minute,
              IFNULL(B.working_minute, 0)    AS working_minute
            FROM Rekap_A A
            LEFT JOIN work_time B
              ON A.tgl = DATE(B.date)
              AND A.pic_id = B.pic_id
            LEFT JOIN pics C
              ON A.pic_id = C.id
            {$outerWhere}
            ORDER BY A.tgl
        ";
    return $this->query($sql, $params, true);
  }
}
