<?php

namespace Controllers;

use PDO;
use PDOException;

/**
 * PicController
 *
 * Handles retrieval of PIC (Person In Charge) data.
 */
class PicController extends BaseController
{
    /**
     * GET /pics
     *
     * Fetch all PICs with their division and role, excluding Admin.
     */
    public function index()
    {
        try {
            $sql = "SELECT p.id as id, p.full_name as full_name, p.name as name,
                    d.name as division, r.name as role, p.nik as nik, r.level as level
                    FROM pics p
                    JOIN divisions d ON p.division_id = d.id
                    JOIN roles r ON p.role_id = r.id
                    WHERE r.name != 'Admin'
                    ORDER BY name ASC";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json($result);

        } catch (PDOException $e) {
            $this->error('Gagal mengambil data.', 500, $e->getMessage());
        }
    }
}
