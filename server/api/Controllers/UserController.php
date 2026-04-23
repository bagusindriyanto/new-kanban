<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * UserController
 *
 * Handles user account updates (self-update only).
 */
class UserController extends BaseController
{
    /**
     * PATCH /users
     *
     * Update the authenticated user's profile and credentials.
     */
    public function update()
    {
        $user = $this->user();
        $id   = $user['user_id'] ?? null;

        if (!$id) {
            $this->error('Unauthorized.', 401);
        }

        $input = $this->request->getBody();

        $fullName = isset($input['full_name']) ? trim($input['full_name']) : '';
        $name     = isset($input['name']) && trim($input['name']) !== ''
                      ? trim($input['name'])
                      : trim(explode(' ', $fullName)[0]);
        $nik      = isset($input['nik']) ? trim($input['nik']) : '';
        $email    = isset($input['email']) ? trim($input['email']) : '';
        $password = $input['password'] ?? '';

        // Validate required fields
        if (!$fullName || !$nik || !$email || !$password || !$id) {
            $this->error('Semua field wajib diisi.');
        }

        try {
            // Check user exists
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE id = ?');
            $stmt->execute([$id]);
            if ($stmt->fetchColumn() === 0) {
                $this->error('Gagal mengubah data.', 404, 'User tidak ditemukan.');
            }

            // Check email uniqueness (excluding current user)
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE email = ? AND id <> ?');
            $stmt->execute([$email, $id]);
            if ($stmt->fetchColumn() > 0) {
                $this->error(
                    'Gagal mengubah data.', 400,
                    'Email sudah terdaftar. Silahkan gunakan email lain.'
                );
            }

            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $this->db->beginTransaction();

            // Update user credentials
            $stmt = $this->db->prepare(
                'UPDATE users SET email = :email, password = :password WHERE id = :id'
            );
            $stmt->execute([':email' => $email, ':password' => $hashedPassword, ':id' => $id]);

            // Update PIC profile
            $stmt = $this->db->prepare(
                'UPDATE pics SET full_name = :full_name, name = :name, nik = :nik WHERE user_id = :id'
            );
            $stmt->execute([':full_name' => $fullName, ':name' => $name, ':nik' => $nik, ':id' => $id]);

            $this->db->commit();

            // Build updated user data for response
            $updatedUser = array_merge($user, [
                'full_name' => $fullName,
                'name'      => $name,
                'nik'       => $nik,
                'email'     => $email,
            ]);

            $this->json([
                'status'  => 'success',
                'message' => 'Berhasil mengubah data.',
                'user'    => $updatedUser,
            ], 201);

        } catch (PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            $this->error('Gagal mengubah data.', 500, $e->getMessage());
        }
    }
}
