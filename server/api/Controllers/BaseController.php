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
}
