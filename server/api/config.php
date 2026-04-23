<?php

/**
 * Central Configuration
 *
 * Database credentials, JWT settings, and CORS configuration.
 * Change JWT_SECRET before deploying to production!
 */

return [
    // Database
    'db' => [
        'host'     => 'localhost',
        'name'     => 'kanban_app',
        'user'     => 'root',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],

    // JWT
    'jwt' => [
        'secret'      => 'your-super-secret-key-change-this-in-production',
        'access_ttl'  => 900,      // 15 minutes
        'refresh_ttl' => 604800,   // 7 days
        'algorithm'   => 'SHA256',
        'issuer'      => 'kanban-app',
    ],

    // CORS
    'cors' => [
        'allowed_origin'  => 'http://localhost:5173',
        'allowed_methods' => 'GET, POST, PATCH, DELETE, OPTIONS',
        'allowed_headers' => 'Content-Type, Authorization',
        'allow_credentials' => false,
    ],
];
