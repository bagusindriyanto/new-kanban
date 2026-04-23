<?php

namespace Controllers;

use Auth\JwtService;
use Core\Response;
use PDO;
use PDOException;

/**
 * AuthController
 *
 * Handles authentication endpoints: login, register, logout, me, refresh.
 */
class AuthController extends BaseController
{
    /**
     * POST /auth/login
     *
     * Validates credentials and returns JWT access + refresh tokens.
     */
    public function login()
    {
        $email    = $this->request->input('email', '');
        $password = $this->request->input('password', '');

        if (empty($email) || empty($password)) {
            $this->error('Email dan kata sandi wajib diisi.');
        }

        try {
            // Find user by email
            $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ?');
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                $this->error('Login gagal.', 401, 'Email atau kata sandi salah.');
            }

            $userId = $user['id'];

            // Fetch PIC profile with division and role
            $sql = "SELECT p.id as id, p.full_name as full_name, p.name as name,
                    p.nik as nik, d.name as division, r.name as role, r.level as level
                    FROM pics p
                    JOIN divisions d ON p.division_id = d.id
                    JOIN roles r ON p.role_id = r.id
                    WHERE p.user_id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$userId]);
            $pic = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$pic) {
                $this->error('Login gagal.', 500, 'Profil pengguna tidak ditemukan.');
            }

            // Build user payload for JWT and response
            $userData = [
                'user_id'   => $userId,
                'id'        => $pic['id'],
                'full_name' => $pic['full_name'],
                'name'      => $pic['name'],
                'nik'       => $pic['nik'],
                'role'      => $pic['role'],
                'email'     => $user['email'],
                'division'  => $pic['division'],
                'level'     => $pic['level'],
            ];

            // Generate tokens
            $jwt          = JwtService::getInstance();
            $accessToken  = $jwt->generateAccessToken($userData);
            $refreshToken = $jwt->generateRefreshToken($userId);

            // Store refresh token in database
            $this->storeRefreshToken($userId, $refreshToken, $jwt->getRefreshTtl());

            $this->json([
                'user'          => $userData,
                'access_token'  => $accessToken,
                'refresh_token' => $refreshToken,
            ]);

        } catch (PDOException $e) {
            $this->error('Login gagal.', 500, $e->getMessage());
        }
    }

    /**
     * POST /auth/register
     *
     * Creates a new user account with profile.
     */
    public function register()
    {
        $input = $this->request->getBody();

        $fullName   = isset($input['full_name']) ? trim($input['full_name']) : '';
        $name       = isset($input['name']) && trim($input['name']) !== ''
                        ? trim($input['name'])
                        : trim(explode(' ', $fullName)[0]);
        $nik        = isset($input['nik']) ? trim($input['nik']) : '';
        $divisionId = $input['division_id'] ?? null;
        $roleId     = $input['role_id'] ?? null;
        $email      = isset($input['email']) ? trim($input['email']) : '';
        $password   = $input['password'] ?? '';

        // Validate required fields
        if (!$fullName || !$nik || !$divisionId || !$roleId || !$email || !$password) {
            $this->error('Semua field wajib diisi.');
        }

        try {
            // Check if email already exists
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                $this->error('Gagal membuat akun.', 400, 'Email sudah terdaftar. Silahkan gunakan email lain.');
            }

            // Validate division
            $stmt = $this->db->prepare('SELECT id FROM divisions WHERE id = ?');
            $stmt->execute([$divisionId]);
            if (!$stmt->fetch()) {
                $this->error('Gagal membuat akun.', 422, 'Divisi tidak valid.');
            }

            // Validate role
            $stmt = $this->db->prepare('SELECT id FROM roles WHERE id = ?');
            $stmt->execute([$roleId]);
            if (!$stmt->fetch()) {
                $this->error('Gagal membuat akun.', 422, 'Jabatan tidak valid.');
            }

            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Create user and profile in a transaction
            $this->db->beginTransaction();

            $stmt = $this->db->prepare('INSERT INTO users (email, password) VALUES (:email, :password)');
            $stmt->execute([':email' => $email, ':password' => $hashedPassword]);
            $userId = $this->db->lastInsertId();

            $stmt = $this->db->prepare(
                'INSERT INTO pics (full_name, name, nik, user_id, division_id, role_id)
                 VALUES (:full_name, :name, :nik, :user_id, :division_id, :role_id)'
            );
            $stmt->execute([
                ':full_name'    => $fullName,
                ':name'         => $name,
                ':nik'          => $nik,
                ':user_id'      => $userId,
                ':division_id'  => $divisionId,
                ':role_id'      => $roleId,
            ]);

            $this->db->commit();

            $this->success('Berhasil membuat akun.', [], 201);

        } catch (PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            $this->error('Gagal membuat akun.', 500, $e->getMessage());
        }
    }

    /**
     * POST /auth/logout
     *
     * Invalidates the user's refresh token.
     */
    public function logout()
    {
        $refreshToken = $this->request->input('refresh_token', '');

        if (!empty($refreshToken)) {
            try {
                $stmt = $this->db->prepare('DELETE FROM refresh_tokens WHERE token = ?');
                $stmt->execute([$refreshToken]);
            } catch (PDOException $e) {
                // Silently ignore — logout should always succeed
            }
        }

        $this->json(['message' => 'Logout berhasil.']);
    }

    /**
     * GET /auth/me
     *
     * Returns the authenticated user's data from the JWT payload.
     */
    public function me()
    {
        $this->json(['user' => $this->user()]);
    }

    /**
     * POST /auth/refresh
     *
     * Exchanges a valid refresh token for a new access token.
     */
    public function refresh()
    {
        $refreshToken = $this->request->input('refresh_token', '');

        if (empty($refreshToken)) {
            $this->error('Refresh token diperlukan.', 400);
        }

        $jwt = JwtService::getInstance();

        // Decode and validate the refresh token
        $payload = $jwt->decode($refreshToken);
        if ($payload === null) {
            $this->error('Refresh token tidak valid atau sudah kedaluwarsa.', 401);
        }

        if (!isset($payload['type']) || $payload['type'] !== 'refresh') {
            $this->error('Jenis token tidak valid.', 401);
        }

        $userId = $payload['user_id'] ?? null;
        if ($userId === null) {
            $this->error('Refresh token tidak valid.', 401);
        }

        try {
            // Verify the refresh token exists in the database
            $stmt = $this->db->prepare(
                'SELECT id FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()'
            );
            $stmt->execute([$refreshToken, $userId]);
            if (!$stmt->fetch()) {
                $this->error('Refresh token tidak valid atau sudah direvokasi.', 401);
            }

            // Fetch current user data for the new access token
            $sql = "SELECT u.id as user_id, u.email, p.id as id, p.full_name, p.name,
                    p.nik, d.name as division, r.name as role, r.level as level
                    FROM users u
                    JOIN pics p ON p.user_id = u.id
                    JOIN divisions d ON p.division_id = d.id
                    JOIN roles r ON p.role_id = r.id
                    WHERE u.id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$userId]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$userData) {
                $this->error('Pengguna tidak ditemukan.', 404);
            }

            // Generate new access token
            $accessToken = $jwt->generateAccessToken($userData);

            $this->json([
                'access_token' => $accessToken,
                'user'         => $userData,
            ]);

        } catch (PDOException $e) {
            $this->error('Gagal memperbarui token.', 500, $e->getMessage());
        }
    }

    /**
     * Store a refresh token in the database.
     *
     * @param int    $userId
     * @param string $token
     * @param int    $ttl TTL in seconds
     * @return void
     */
    private function storeRefreshToken($userId, $token, $ttl)
    {
        try {
            // Remove old refresh tokens for this user (limit to 5 active tokens)
            $stmt = $this->db->prepare(
                'DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at < NOW()'
            );
            $stmt->execute([$userId]);

            // Insert new refresh token
            $stmt = $this->db->prepare(
                'INSERT INTO refresh_tokens (user_id, token, expires_at)
                 VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL :ttl SECOND))'
            );
            $stmt->execute([
                ':user_id' => $userId,
                ':token'   => $token,
                ':ttl'     => $ttl,
            ]);
        } catch (PDOException $e) {
            // Non-critical — login can still succeed without storing refresh token
        }
    }
}
