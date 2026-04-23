<?php

namespace Auth;

use Core\Request;
use Core\Response;

/**
 * AuthMiddleware
 *
 * Extracts and validates the JWT from the Authorization header.
 * On success, injects the authenticated user data into the Request.
 * On failure, responds with 401 Unauthorized.
 */
class AuthMiddleware
{
    /**
     * Handle the authentication check.
     *
     * @param Request $request
     * @return void
     */
    public static function handle(Request $request)
    {
        $authHeader = $request->getHeader('Authorization');

        if ($authHeader === null || strpos($authHeader, 'Bearer ') !== 0) {
            Response::error('Unauthorized. Token tidak ditemukan.', 401);
        }

        $token = substr($authHeader, 7); // Remove "Bearer " prefix

        $jwt = JwtService::getInstance();
        $payload = $jwt->decode($token);

        if ($payload === null) {
            Response::error('Unauthorized. Token tidak valid atau sudah kedaluwarsa.', 401);
        }

        // Ensure this is an access token, not a refresh token
        if (!isset($payload['type']) || $payload['type'] !== 'access') {
            Response::error('Unauthorized. Jenis token tidak valid.', 401);
        }

        // Inject user data into the request
        if (isset($payload['data'])) {
            $request->setUser($payload['data']);
        } else {
            Response::error('Unauthorized. Data pengguna tidak ditemukan dalam token.', 401);
        }
    }
}
