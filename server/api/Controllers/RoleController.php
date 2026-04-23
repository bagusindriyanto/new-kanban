<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * RoleController
 *
 * Handles CRUD operations for roles.
 */
class RoleController extends BaseController
{
    /**
     * GET /roles
     *
     * Fetch all roles excluding 'Admin', ordered by level DESC.
     */
    public function index()
    {
        try {
            $sql = "SELECT * FROM roles WHERE name <> 'Admin' ORDER BY level DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json($result);

        } catch (PDOException $e) {
            $this->error('Gagal mengambil data.', 500, $e->getMessage());
        }
    }

    /**
     * POST /roles
     *
     * Create a new role.
     */
    public function store()
    {
        $name  = $this->request->input('name');
        $level = $this->request->input('level');

        if (!isset($name) || !isset($level)) {
            $this->error('Nama dan level diperlukan.');
        }

        try {
            $stmt = $this->db->prepare('INSERT INTO roles (name, level) VALUES (:name, :level)');
            $stmt->execute([':name' => $name, ':level' => $level]);

            $this->json([
                'id'    => $this->db->lastInsertId(),
                'name'  => $name,
                'level' => $level,
            ], 201);

        } catch (PDOException $e) {
            $this->error('Gagal menambahkan jabatan.', 500, $e->getMessage());
        }
    }
}
