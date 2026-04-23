<?php

namespace Core;

/**
 * Response
 *
 * Static helper for sending consistent JSON responses.
 */
class Response
{
    /**
     * Send a JSON response and terminate.
     *
     * @param mixed $data
     * @param int   $statusCode
     * @return void
     */
    public static function json($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_NUMERIC_CHECK);
        exit();
    }

    /**
     * Send a JSON success response and terminate.
     *
     * @param string $message
     * @param array  $data Additional data to merge
     * @param int    $statusCode
     * @return void
     */
    public static function success($message, array $data = [], $statusCode = 200)
    {
        $response = array_merge(['status' => 'success', 'message' => $message], $data);
        self::json($response, $statusCode);
    }

    /**
     * Send a JSON error response and terminate.
     *
     * @param string      $message
     * @param int         $statusCode
     * @param string|null $detail
     * @return void
     */
    public static function error($message, $statusCode = 400, $detail = null)
    {
        $response = [
            'status'  => 'error',
            'message' => $message,
        ];

        if ($detail !== null) {
            $response['error_detail'] = $detail;
        }

        self::json($response, $statusCode);
    }
}
