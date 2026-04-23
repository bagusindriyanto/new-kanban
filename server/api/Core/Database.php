<?php

namespace Core;

use PDO;
use PDOException;

/**
 * Database Singleton
 *
 * Provides a single shared PDO instance across the application.
 */
class Database
{
    /** @var PDO|null */
    private static $instance = null;

    /** @var array */
    private static $config = [];

    /**
     * Prevent direct instantiation.
     */
    private function __construct()
    {
    }

    /**
     * Set database configuration.
     *
     * @param array $config
     * @return void
     */
    public static function configure(array $config)
    {
        self::$config = $config;
    }

    /**
     * Get the PDO instance (creates one if it doesn't exist).
     *
     * @return PDO
     * @throws PDOException
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            $cfg = self::$config;
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                $cfg['host'],
                $cfg['name'],
                $cfg['charset'] ?? 'utf8mb4'
            );

            self::$instance = new PDO($dsn, $cfg['user'], $cfg['password'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        }

        return self::$instance;
    }
}
