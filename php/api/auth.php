<?php
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode([
      "status" => "error",
      "message" => "Unauthorized. Harap login terlebih dahulu."
    ]);
    exit;
}