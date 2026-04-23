<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * ActivityController
 *
 * Handles CRUD operations for activities.
 */
class ActivityController extends BaseController
{
    /**
     * GET /activities
     *
     * Fetch all activities ordered by created_at DESC.
     */
    public function index()
    {
        try {
            $sql = "SELECT * FROM activities ORDER BY created_at DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json($result);

        } catch (PDOException $e) {
            $this->error('Gagal mengambil data.', 500, $e->getMessage());
        }
    }

    /**
     * POST /activities
     *
     * Create a new activity.
     */
    public function store()
    {
        $activity = $this->request->input('activity');

        if (!$activity) {
            $this->error('Nama activity diperlukan.');
        }

        try {
            $name = trim($activity);
            $stmt = $this->db->prepare('INSERT INTO activities (name) VALUES (:name)');
            $stmt->execute([':name' => $name]);

            $this->json([
                'id'       => $this->db->lastInsertId(),
                'activity' => $name,
            ], 201);

        } catch (PDOException $e) {
            $this->error('Gagal menambahkan activity.', 500, $e->getMessage());
        }
    }
}
