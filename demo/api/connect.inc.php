<?php
ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT);
include dirname(__FILE__) . "/NotORM.php";

$connection = new PDO("mysql:dbname=zeniths_edu", "sa","1");
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$connection->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
$db = new NotORM($connection);
$db->debug = function($query, $params)
{
    print_r(['query' => $query, 'params' => $params]);
};
