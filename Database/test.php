<?php

    $user="cssa2022js_parser";
    $pwd="cssa2022";
    $dbhost="140.116.154.84:27017";
    //echo "function connect \n";
    $mongoClient = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
    $query = new MongoDB\Driver\Query([]);
    
    /*$rows = $mongoClient -> executeQuery("JavascriptParser.moduleschemas",$query);
    foreach($rows as $row){
        echo $row->path;
        echo "\n";
    }*/

    /*function connect(){
        echo "function connect \n";
        $mongoClient = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
        $query = new MongoDB\Driver\Query([]);
        $rows = $mongoClient -> executeQuery("JavascriptParser.moduleschemas",$query);
        foreach($rows as $row){
            echo $row->path;
            echo "\n";
        }
    }*/
?>