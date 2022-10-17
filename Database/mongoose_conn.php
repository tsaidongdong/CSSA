<?php

function add(){
    echo "in the add";
}

function find(){
    echo "in the find";

}

function findById(){
    echo "in the findById";
}

function findAll(){
    echo "in the findAll";
}

function addTag(){
    echo "in the addTag";
}

function getTags(){
    echo "in the getTags";
}


$user="cssa2022js_parser";
$pwd="cssa2022";
$dbhost="140.116.154.84:27017";
$dbname = 'JavascriptParser';

$mongoClient = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
/*$db = $mongoClient->$dbname;
$cDemo = $db->demo;*/

/*// 設定查詢條件
$queryCondition = array(
    'path' => 'index.js',
  );

// 查詢資料
$result = $cDemo->findOne($queryCondition);
print_r($result);*/

$query = new MongoDB\Driver\Query([]);
$rows = $mongoClient -> executeQuery("JavascriptParser.moduleschemas",$query);
foreach($rows as $row){
        echo $row->path;
        echo "\n";
}

if(isset($_POST)){
    
    error_log("receive a mongoose");
    $result = json_encode($_POST);
    error_log($result);
    /*switch($_POST['Operation']){
        case 'add':
           add($_POST['data']);
           break;
        case 'find':
           find($_POST['data']);
           break;
        case 'findById':
           findById($_POST['data']);
           break;
        case 'findAll':
           findAll($_POST['data']);
           break;
        case 'addTag':
           addTag($_POST['data']);
           break;
        case 'getTags':
           getTags($_POST['data']);
           break;
    }*/
    echo "success";
}else{
    echo "receive nothing\n";
}

?>