<?php

namespace Rbac;

use Core\Request;
use Core\Response;

/**
 * RbacMiddleware
 *
 * Role-Based Access Control middleware.
 * Checks whether the authenticated user's role is in the list
 * of allowed roles for the current route.
 */
class RbacMiddleware
{
    /**
     * Handle the RBAC check.
     *
     * @param Request $request
     * @param array   $allowedRoles e.g. ['Admin', 'Manager']
     * @return void
     */
    public static function handle(Request $request, array $allowedRoles = [])
    {
        $user = $request->getUser();

        if ($user === null) {
            Response::error('Unauthorized. Harap login terlebih dahulu.', 401);
        }

        $userRole = $user['role'] ?? null;

        if ($userRole === null || !in_array($userRole, $allowedRoles, true)) {
            Response::error(
                'Forbidden. Anda tidak memiliki akses untuk tindakan ini.',
                403
            );
        }
    }
}
