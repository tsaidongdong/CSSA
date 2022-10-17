<?php

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}



$user="cssa2022js_parser";
$pwd="cssa2022";
$dbhost="140.116.154.84:27017";


$mongoClient = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
$query = new MongoDB\Driver\Query([]);
$rows = $mongoClient -> executeQuery("JavascriptParser.moduleschemas",$query);
foreach($rows as $row){
        echo $row->path;
        echo "\n";
}

if(isset($_POST)){
    error_log("receive a post");
    //echo "receive post\n";
    $result = json_encode($_POST);
    error_log($result);
    // $result = array_keys($_POST);
    // error_log(print_r($result,true));
    // $result = array_keys($_POST["description"]);
    // error_log(print_r($result,true));
    // $result = json_decode($_POST[[0]]);
    // // error_log($_POST[[0]]);
    // error_log($result);
    //echo $result;
    
    echo "success";
}else{
    echo "receive nothing\n";
}

?>