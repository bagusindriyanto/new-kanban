<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "kanban_app";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec("SET time_zone = '+07:00'");
} catch (PDOException $e) {
  die("Connection failed: " . $e->getMessage());
}
