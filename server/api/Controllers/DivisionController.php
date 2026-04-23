<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * DivisionController
 *
 * Handles CRUD operations for divisions.
 */
class DivisionController extends BaseController
{
    /**
     * GET /divisions
     *
     * Fetch all divisions, excluding 'Administrator'.
     */
    public function index()
    {
        try {
            $sql = "SELECT * FROM divisions WHERE name <> 'Administrator' ORDER BY name ASC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json($result);

        } catch (PDOException $e) {
            $this->error('Gagal mengambil data.', 500, $e->getMessage());
        }
    }

    /**
     * POST /divisions
     *
     * Create a new division.
     */
    public function store()
    {
        $name = $this->request->input('name');

        if (!$name) {
            $this->error('Nama divisi diperlukan.');
        }

        try {
            $stmt = $this->db->prepare('INSERT INTO divisions (name) VALUES (:name)');
            $stmt->execute([':name' => $name]);

            $this->json([
                'id'   => $this->db->lastInsertId(),
                'name' => $name,
            ], 201);

        } catch (PDOException $e) {
            $this->error('Gagal menambahkan divisi.', 500, $e->getMessage());
        }
    }
}
