<?php
$host = "localhost";
$user = "dani";
$password = "semarang";
$dbname = "kanban_app";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  http_response_code(500);
  die("Connection failed: " . $e->getMessage());
}
