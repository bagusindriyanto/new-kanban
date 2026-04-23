<?php

/**
 * Front Controller
 *
 * Single entry point for all API requests.
 * Handles autoloading, CORS, and route dispatching.
 */

// ─── Load Configuration ─────────────────────────────────────
$config = require __DIR__ . '/config.php';

// ─── Autoloader ──────────────────────────────────────────────
spl_autoload_register(function ($class) {
    // Convert namespace separators to directory separators
    $file = __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// ─── CORS Headers ────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$corsConfig = $config['cors'];

if ($origin === $corsConfig['allowed_origin']) {
    header("Access-Control-Allow-Origin: " . $corsConfig['allowed_origin']);
    header("Access-Control-Allow-Methods: " . $corsConfig['allowed_methods']);
    header("Access-Control-Allow-Headers: " . $corsConfig['allowed_headers']);

    if ($corsConfig['allow_credentials']) {
        header("Access-Control-Allow-Credentials: true");
    }
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─── Set Content-Type ────────────────────────────────────────
header('Content-Type: application/json');

// ─── Initialize Services ────────────────────────────────────
use Core\Database;
use Core\Request;
use Core\Router;
use Auth\JwtService;

use Controllers\AuthController;
use Controllers\TaskController;
use Controllers\PicController;
use Controllers\DivisionController;
use Controllers\RoleController;
use Controllers\ActivityController;
use Controllers\SummaryController;
use Controllers\UserController;

Database::configure($config['db']);
JwtService::configure($config['jwt']);

// ─── Create Request & Router ─────────────────────────────────
$request = new Request();
$router  = new Router($request);

// ─── Define Routes ───────────────────────────────────────────

// Auth routes (public)
$router->add('POST', '/auth/login',    [AuthController::class, 'login']);
$router->add('POST', '/auth/register', [AuthController::class, 'register']);
$router->add('POST', '/auth/refresh',  [AuthController::class, 'refresh']);

// Auth routes (authenticated)
$router->add('GET',  '/auth/me',       [AuthController::class, 'me'],     ['auth']);
$router->add('POST', '/auth/logout',   [AuthController::class, 'logout'], ['auth']);

// Public lookup routes
$router->add('GET', '/divisions', [DivisionController::class, 'index']);
$router->add('GET', '/roles',    [RoleController::class, 'index']);

// Task routes (all authenticated roles)
$allRoles = 'rbac:Admin,Manager,Supervisor,Staff';
$router->add('GET',    '/tasks', [TaskController::class, 'index'],   ['auth', $allRoles]);
$router->add('POST',   '/tasks', [TaskController::class, 'store'],   ['auth', $allRoles]);
$router->add('PATCH',  '/tasks', [TaskController::class, 'update'],  ['auth', $allRoles]);
$router->add('DELETE', '/tasks', [TaskController::class, 'destroy'], ['auth', 'rbac:Admin,Manager']);

// PIC routes
$router->add('GET', '/pics', [PicController::class, 'index'], ['auth', $allRoles]);

// Division & Role management (Admin only)
$router->add('POST', '/divisions', [DivisionController::class, 'store'], ['auth', 'rbac:Admin']);
$router->add('POST', '/roles',    [RoleController::class, 'store'],     ['auth', 'rbac:Admin']);

// Activity routes
$router->add('GET',  '/activities', [ActivityController::class, 'index'], ['auth', $allRoles]);
$router->add('POST', '/activities', [ActivityController::class, 'store'], ['auth', $allRoles]);

// Summary routes
$router->add('GET', '/summary', [SummaryController::class, 'index'], ['auth', $allRoles]);

// User routes (self-update)
$router->add('PATCH', '/users', [UserController::class, 'update'], ['auth', $allRoles]);

// ─── Dispatch ────────────────────────────────────────────────
$router->dispatch();
