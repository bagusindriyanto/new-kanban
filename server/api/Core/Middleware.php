<?php

namespace Core;

use Auth\AuthMiddleware;
use Rbac\RbacMiddleware;

/**
 * Middleware
 *
 * Registry and pipeline runner for middleware.
 * Parses middleware strings like 'auth' and 'rbac:Admin,Manager'.
 */
class Middleware
{
    /**
     * Run a list of middleware against the request.
     *
     * @param array   $middlewareList e.g. ['auth', 'rbac:Admin,Manager']
     * @param Request $request
     * @return void
     */
    public static function run(array $middlewareList, Request $request)
    {
        foreach ($middlewareList as $entry) {
            self::execute($entry, $request);
        }
    }

    /**
     * Parse and execute a single middleware entry.
     *
     * @param string  $entry   e.g. 'auth' or 'rbac:Admin,Manager,Staff'
     * @param Request $request
     * @return void
     */
    private static function execute($entry, Request $request)
    {
        // Split "name:param1,param2" into name and params
        $parts  = explode(':', $entry, 2);
        $name   = $parts[0];
        $params = isset($parts[1]) ? explode(',', $parts[1]) : [];

        switch ($name) {
            case 'auth':
                AuthMiddleware::handle($request);
                break;

            case 'rbac':
                RbacMiddleware::handle($request, $params);
                break;

            default:
                Response::error('Middleware tidak dikenal: ' . $name, 500);
        }
    }
}
