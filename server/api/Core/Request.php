<?php

namespace Core;

/**
 * Request
 *
 * Encapsulates all incoming HTTP request data: method, URI, headers,
 * JSON body, and query parameters. Also carries authenticated user data
 * injected by AuthMiddleware.
 */
class Request
{
    /** @var string */
    private $method;

    /** @var string */
    private $uri;

    /** @var array|null */
    private $body;

    /** @var array */
    private $query;

    /** @var array|null Authenticated user payload from JWT */
    private $user = null;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri    = $this->parseUri();
        $this->query  = $_GET;
        $this->body   = json_decode(file_get_contents('php://input'), true);
    }

    /**
     * Parse and clean the request URI.
     *
     * Strips the base path (everything up to and including /api)
     * so routes are relative: /tasks, /auth/login, etc.
     *
     * @return string
     */
    private function parseUri()
    {
        $uri = $_SERVER['REQUEST_URI'];

        // Remove query string
        $pos = strpos($uri, '?');
        if ($pos !== false) {
            $uri = substr($uri, 0, $pos);
        }

        // Strip the base path up to /api/
        // e.g. /kanban/api/tasks → /tasks
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $basePath = dirname($scriptName);
        if ($basePath !== '/' && $basePath !== '\\') {
            $uri = substr($uri, strlen($basePath));
        }

        // Ensure leading slash and remove trailing slash
        $uri = '/' . ltrim($uri, '/');
        $uri = rtrim($uri, '/');

        if ($uri === '') {
            $uri = '/';
        }

        return $uri;
    }

    /**
     * @return string
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * @return string
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Get the parsed JSON body.
     *
     * @return array|null
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Get a specific field from the JSON body.
     *
     * @param string $key
     * @param mixed  $default
     * @return mixed
     */
    public function input($key, $default = null)
    {
        if ($this->body === null) {
            return $default;
        }

        return array_key_exists($key, $this->body) ? $this->body[$key] : $default;
    }

    /**
     * Get a query parameter.
     *
     * @param string $key
     * @param mixed  $default
     * @return mixed
     */
    public function query($key, $default = null)
    {
        return array_key_exists($key, $this->query) ? $this->query[$key] : $default;
    }

    /**
     * Get a request header value.
     *
     * @param string $name Header name (case-insensitive)
     * @return string|null
     */
    public function getHeader($name)
    {
        // PHP stores headers as HTTP_HEADER_NAME in $_SERVER
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));

        if (isset($_SERVER[$key])) {
            return $_SERVER[$key];
        }

        // Special case for Content-Type and Authorization
        $special = strtoupper(str_replace('-', '_', $name));
        if (isset($_SERVER[$special])) {
            return $_SERVER[$special];
        }

        // Fallback: use apache_request_headers() / getallheaders()
        // This covers CGI/FastCGI setups where $_SERVER may not have the header
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            foreach ($headers as $headerName => $value) {
                if (strcasecmp($headerName, $name) === 0) {
                    return $value;
                }
            }
        }

        return null;
    }

    /**
     * Set the authenticated user data (called by AuthMiddleware).
     *
     * @param array $user
     * @return void
     */
    public function setUser(array $user)
    {
        $this->user = $user;
    }

    /**
     * Get the authenticated user data.
     *
     * @return array|null
     */
    public function getUser()
    {
        return $this->user;
    }
}
