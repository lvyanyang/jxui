<?php
include_once dirname(__FILE__) . "/connect.inc.php";
$db->debug = false;
$sql = $db->student()->select("id,name, CreateDateTime")
    ->where("name LIKE ?", "张%")
    ->order('createDateTime')->limit(5);
//echo $sql;
//echo "\n";
$result = [];
foreach ($sql as $row) {
    $result[] = $row;
}
header('Content-type:text/json;charset=UTF-8');
echo json_encode($result);
