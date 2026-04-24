<?php

namespace Controllers;

use Core\Database;
use Core\Request;
use Core\Response;
use PDO;

/**
 * BaseController
 *
 * Abstract base class for all controllers.
 * Provides shared access to the database connection, request object,
 * and authenticated user data.
 */
abstract class BaseController
{
    /** @var PDO */
    protected $db;

    /** @var Request */
    protected $request;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->db      = Database::getInstance();
        $this->request = $request;
    }

    /**
     * Get the authenticated user data from the request.
     *
     * @return array|null
     */
    protected function user()
    {
        return $this->request->getUser();
    }

    /**
     * Shortcut: send a JSON success response.
     *
     * @param string $message
     * @param array  $data
     * @param int    $statusCode
     * @return void
     */
    protected function success($message, array $data = [], $statusCode = 200)
    {
        Response::success($message, $data, $statusCode);
    }

    /**
     * Shortcut: send a JSON error response.
     *
     * @param string      $message
     * @param int         $statusCode
     * @param string|null $detail
     * @return void
     */
    protected function error($message, $statusCode = 400, $detail = null)
    {
        Response::error($message, $statusCode, $detail);
    }

    /**
     * Shortcut: send raw JSON data.
     *
     * @param mixed $data
     * @param int   $statusCode
     * @return void
     */
    protected function json($data, $statusCode = 200)
    {
        Response::json($data, $statusCode);
    }

    /**
     * Assert that the authenticated user owns the given task.
     *
     * Compares the task's pic_id with the logged-in user's PIC id.
     * Admin and Manager roles are exempted (they can manage all tasks).
     * Sends a 403 response and terminates if the check fails.
     *
     * @param int $taskId
     * @return void
     */
    protected function assertOwner($taskId)
    {
        $user = $this->user();

        // Admin dan Manager boleh mengelola semua task
        $exemptRoles = ['Admin', 'Manager'];
        if (in_array($user['role'] ?? '', $exemptRoles, true)) {
            return;
        }

        // Ambil pic_id dari task
        $stmt = $this->db->prepare('SELECT pic_id FROM tasks WHERE id = ?');
        $stmt->execute([$taskId]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$task) {
            $this->error('Task tidak ditemukan.', 404);
        }

        // Bandingkan pic_id task dengan id PIC user yang login
        if ((int) $task['pic_id'] !== (int) $user['id']) {
            $this->error(
                'Forbidden. Anda hanya bisa mengelola task milik anda sendiri.',
                403
            );
        }
    }
}
