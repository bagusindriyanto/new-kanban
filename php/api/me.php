<?php
header("Content-Type: application/json");

require_once "cors.php";
require_once "auth.php";

echo json_encode(["user" => $_SESSION['user']], JSON_NUMERIC_CHECK);
