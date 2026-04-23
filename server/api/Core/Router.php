<?php

namespace Core;

/**
 * Router
 *
 * Simple URI + HTTP method router. Supports middleware definitions
 * per route and dispatches to controller methods.
 */
class Router
{
    /**
     * Registered routes.
     *
     * Each entry: ['method' => string, 'path' => string, 'handler' => callable|array, 'middleware' => array]
     *
     * @var array
     */
    private $routes = [];

    /** @var Request */
    private $request;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Register a route.
     *
     * @param string         $method     HTTP method (GET, POST, PATCH, DELETE)
     * @param string         $path       URI path (e.g. '/tasks')
     * @param array|callable $handler    [ControllerClass, 'method'] or callable
     * @param array          $middleware List of middleware strings (e.g. ['auth', 'rbac:Admin,Manager'])
     * @return void
     */
    public function add($method, $path, $handler, array $middleware = [])
    {
        $this->routes[] = [
            'method'     => strtoupper($method),
            'path'       => $path,
            'handler'    => $handler,
            'middleware'  => $middleware,
        ];
    }

    /**
     * Dispatch the current request to the matching route.
     *
     * @return void
     */
    public function dispatch()
    {
        $method = $this->request->getMethod();
        $uri    = $this->request->getUri();

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $route['path'] === $uri) {
                // Run middleware pipeline
                Middleware::run($route['middleware'], $this->request);

                // Execute controller handler
                $this->executeHandler($route['handler']);
                return;
            }
        }

        // No route matched
        Response::error('Endpoint tidak ditemukan.', 404);
    }

    /**
     * Execute a route handler.
     *
     * @param array|callable $handler
     * @return void
     */
    private function executeHandler($handler)
    {
        if (is_array($handler) && count($handler) === 2) {
            $className  = $handler[0];
            $methodName = $handler[1];

            $controller = new $className($this->request);
            $controller->{$methodName}();
            return;
        }

        if (is_callable($handler)) {
            call_user_func($handler, $this->request);
            return;
        }

        Response::error('Handler tidak valid.', 500);
    }
}
