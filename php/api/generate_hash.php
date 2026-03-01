<?php
$passwords = [
  1 => 'password123',
  2 => 'password123',
  3 => 'password123',
  4 => 'password123',
  5 => 'password123',
];

foreach ($passwords as $id => $pwd) {
  echo "ID $id : " . password_hash($pwd, PASSWORD_DEFAULT) . "<br>";
}
