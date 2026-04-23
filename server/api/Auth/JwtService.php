<?php

namespace Auth;

/**
 * JwtService
 *
 * Pure PHP JWT implementation using HMAC-SHA256.
 * No external libraries required. Compatible with PHP 7.4+.
 */
class JwtService
{
    /** @var string */
    private $secret;

    /** @var int Access token TTL in seconds */
    private $accessTtl;

    /** @var int Refresh token TTL in seconds */
    private $refreshTtl;

    /** @var string */
    private $issuer;

    /** @var JwtService|null */
    private static $instance = null;

    /**
     * @param array $config JWT config from config.php
     */
    public function __construct(array $config)
    {
        $this->secret     = $config['secret'];
        $this->accessTtl  = $config['access_ttl'];
        $this->refreshTtl = $config['refresh_ttl'];
        $this->issuer     = $config['issuer'] ?? 'kanban-app';
    }

    /**
     * Initialize the singleton instance.
     *
     * @param array $config
     * @return void
     */
    public static function configure(array $config)
    {
        self::$instance = new self($config);
    }

    /**
     * Get the singleton instance.
     *
     * @return self
     */
    public static function getInstance()
    {
        return self::$instance;
    }

    /**
     * Generate an access token containing user data.
     *
     * @param array $userData User payload to embed in the token
     * @return string
     */
    public function generateAccessToken(array $userData)
    {
        $now = time();
        $payload = [
            'iss'  => $this->issuer,
            'iat'  => $now,
            'exp'  => $now + $this->accessTtl,
            'type' => 'access',
            'data' => $userData,
        ];

        return $this->encode($payload);
    }

    /**
     * Generate a refresh token for a user.
     *
     * @param int $userId
     * @return string
     */
    public function generateRefreshToken($userId)
    {
        $now = time();
        $payload = [
            'iss'     => $this->issuer,
            'iat'     => $now,
            'exp'     => $now + $this->refreshTtl,
            'type'    => 'refresh',
            'user_id' => $userId,
        ];

        return $this->encode($payload);
    }

    /**
     * Get the refresh token TTL in seconds.
     *
     * @return int
     */
    public function getRefreshTtl()
    {
        return $this->refreshTtl;
    }

    /**
     * Encode a payload into a JWT string.
     *
     * @param array $payload
     * @return string
     */
    public function encode(array $payload)
    {
        $header = $this->base64UrlEncode(json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256',
        ]));

        $body = $this->base64UrlEncode(json_encode($payload));

        $signature = $this->base64UrlEncode(
            hash_hmac('sha256', $header . '.' . $body, $this->secret, true)
        );

        return $header . '.' . $body . '.' . $signature;
    }

    /**
     * Decode and validate a JWT string.
     *
     * @param string $token
     * @return array|null Returns payload array on success, null on failure
     */
    public function decode($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        $header    = $parts[0];
        $body      = $parts[1];
        $signature = $parts[2];

        // Verify signature
        $expectedSignature = $this->base64UrlEncode(
            hash_hmac('sha256', $header . '.' . $body, $this->secret, true)
        );

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        // Decode payload
        $payload = json_decode($this->base64UrlDecode($body), true);
        if ($payload === null) {
            return null;
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    /**
     * Base64 URL-safe encode.
     *
     * @param string $data
     * @return string
     */
    private function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL-safe decode.
     *
     * @param string $data
     * @return string
     */
    private function base64UrlDecode($data)
    {
        $remainder = strlen($data) % 4;
        if ($remainder !== 0) {
            $data .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($data, '-_', '+/'));
    }
}
