<?php

    $user="cssa2022js_parser";
    $pwd="cssa2022";
    $dbhost="140.116.154.84:27017";
    //echo "function connect \n";
    $manager = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
    
    $bulk = new MongoDB\Driver\BulkWrite();
    
?>