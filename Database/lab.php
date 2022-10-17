<?php
require_once '../vendor/autoload.php'; #按你自己的路徑修改
use MongoDB\Client as Mongo;

$user = "user";
$pwd = 'user';
$ip = "127.0.0.1";
$port = "27017";
$db = "phptutorial";

$mongo = new Mongo("mongodb://${user}:${pwd}@${ip}:${port}/${db}");

echo "TEST";

?>