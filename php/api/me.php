<?php
header("Content-Type: application/json");

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin === 'http://localhost:5173') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: *");
}

require_once "auth.php";

echo json_encode(["user" => $_SESSION['user']]);