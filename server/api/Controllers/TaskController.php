<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * TaskController
 *
 * Handles CRUD operations for tasks.
 */
class TaskController extends BaseController
{
    /**
     * GET /tasks
     *
     * Fetch tasks with optional filters: pic_id, from_date, to_date.
     */
    public function index()
    {
        try {
            $picId    = $this->request->query('pic_id');
            $fromDate = $this->request->query('from_date');
            $toDate   = $this->request->query('to_date', $fromDate);

            $sql = "SELECT t.*,
                    p.name as pic_name,
                    r.level as role_level,
                    a.name as assigner_name
                    FROM tasks t
                    JOIN pics p ON t.pic_id = p.id
                    JOIN roles r ON p.role_id = r.id
                    LEFT JOIN pics a ON t.assigner_id = a.id
                    WHERE 1=1";
            $params = [];

            if ($picId) {
                $sql .= " AND t.pic_id = :pic_id";
                $params[':pic_id'] = $picId;
            }

            if ($fromDate && $toDate) {
                $sql .= " AND (status = 'todo' OR (timestamp_progress BETWEEN :from_date AND :to_date))";
                $params[':from_date'] = $fromDate . " 00:00:00";
                $params[':to_date']   = $toDate . " 23:59:59";
            }

            $sql .= " ORDER BY updated_at DESC";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json($rows);
        } catch (PDOException $e) {
            $this->error('Gagal mengambil data.', 500, $e->getMessage());
        }
    }

    /**
     * POST /tasks
     *
     * Create a new task.
     */
    public function store()
    {
        $input = $this->request->getBody();

        if (!isset($input['pic_id']) || !isset($input['content'])) {
            $this->error('PIC dan Content diperlukan.');
        }

        try {
            $picId          = $input['pic_id'];
            $assignerId     = $input['assigner_id'] ?? null;
            $content        = trim($input['content']);
            $detail         = isset($input['detail']) ? trim($input['detail']) : '';
            $status         = $input['status'] ?? 'todo';
            $scheduledAt    = $input['scheduled_at'] ?? null;
            $timestampTodo  = $input['timestamp_todo'];
            $timestampProg  = null;
            $timestampDone  = null;
            $minutePause    = 0;
            $minuteActivity = 0;
            $pauseTime      = null;

            $sql = "INSERT INTO tasks
                    (pic_id, assigner_id, content, detail, status, scheduled_at,
                     timestamp_todo, timestamp_progress, timestamp_done,
                     minute_pause, minute_activity, pause_time)
                    VALUES (:pic_id, :assigner_id, :content, :detail, :status, :scheduled_at,
                            :timestamp_todo, :timestamp_progress, :timestamp_done,
                            :minute_pause, :minute_activity, :pause_time)";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':pic_id'             => $picId,
                ':assigner_id'        => $assignerId,
                ':content'            => $content,
                ':detail'             => $detail,
                ':status'             => $status,
                ':scheduled_at'       => $scheduledAt,
                ':timestamp_todo'     => $timestampTodo,
                ':timestamp_progress' => $timestampProg,
                ':timestamp_done'     => $timestampDone,
                ':minute_pause'       => $minutePause,
                ':minute_activity'    => $minuteActivity,
                ':pause_time'         => $pauseTime,
            ]);

            $this->json([
                'id'                 => $this->db->lastInsertId(),
                'pic_id'             => $picId,
                'assigner_id'        => $assignerId,
                'content'            => $content,
                'detail'             => $detail,
                'status'             => $status,
                'scheduled_at'       => $scheduledAt,
                'timestamp_todo'     => $timestampTodo,
                'timestamp_progress' => $timestampProg,
                'timestamp_done'     => $timestampDone,
                'minute_pause'       => $minutePause,
                'minute_activity'    => $minuteActivity,
                'pause_time'         => $pauseTime,
            ], 201);
        } catch (PDOException $e) {
            $this->error('Gagal menambahkan task.', 500, $e->getMessage());
        }
    }

    /**
     * PATCH /tasks?id=X
     *
     * Update an existing task.
     */
    public function update()
    {
        $id = $this->request->query('id');
        if (!$id) {
            $this->error('ID diperlukan.');
        }

        $id = intval($id);

        // Cek kepemilikan: hanya pemilik task (atau Admin/Manager) yang boleh edit
        $this->assertOwner($id);

        $input = $this->request->getBody();

        try {
            $picId          = $input['pic_id'];
            $content        = isset($input['content']) ? trim($input['content']) : '';
            $detail         = isset($input['detail']) ? trim($input['detail']) : '';
            $status         = $input['status'] ?? null;
            $scheduledAt    = $input['scheduled_at'] ?? null;
            $timestampTodo  = $input['timestamp_todo'] ?? null;
            $timestampProg  = $input['timestamp_progress'] ?? null;
            $timestampDone  = $input['timestamp_done'] ?? null;
            $minutePause    = $input['minute_pause'] ?? 0;
            $minuteActivity = $input['minute_activity'] ?? 0;
            $pauseTime      = $input['pause_time'] ?? null;

            $fields = [
                'pic_id = ?',
                'content = ?',
                'detail = ?',
                'status = ?',
                'scheduled_at = ?',
                'timestamp_todo = ?',
                'timestamp_progress = ?',
                'timestamp_done = ?',
                'minute_pause = ?',
                'minute_activity = ?',
                'pause_time = ?',
            ];
            $params = [
                $picId,
                $content,
                $detail,
                $status,
                $scheduledAt,
                $timestampTodo,
                $timestampProg,
                $timestampDone,
                $minutePause,
                $minuteActivity,
                $pauseTime,
                $id,
            ];

            $sql = "UPDATE tasks SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            if ($stmt->rowCount() > 0) {
                $stmt = $this->db->prepare('SELECT * FROM tasks WHERE id = :id');
                $stmt->execute([':id' => $id]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->json($data, 201);
            } else {
                $this->error(
                    'Task tidak ditemukan atau tidak terjadi perubahan pada task.',
                    404
                );
            }
        } catch (PDOException $e) {
            $this->error('Gagal memperbarui task.', 500, $e->getMessage());
        }
    }

    /**
     * DELETE /tasks?id=X
     *
     * Delete a task by ID.
     */
    public function destroy()
    {
        $id = $this->request->query('id');
        if (!$id) {
            $this->error('ID diperlukan.');
        }

        $id = intval($id);

        // Cek kepemilikan: hanya pemilik task (atau Admin/Manager) yang boleh hapus
        $this->assertOwner($id);

        try {
            $stmt = $this->db->prepare('DELETE FROM tasks WHERE id = :id');

            if (!$stmt->execute([':id' => $id])) {
                $this->error('Gagal menghapus task.', 500);
            }

            if ($stmt->rowCount() > 0) {
                $this->json(['message' => 'Task berhasil dihapus.', 'id' => $id]);
            } else {
                $this->error(
                    'Task tidak ditemukan atau tidak terjadi perubahan pada task.',
                    404
                );
            }
        } catch (PDOException $e) {
            $this->error('Gagal menghapus task.', 500, $e->getMessage());
        }
    }
}
