<?php

    $user="cssa2022js_parser";
    $pwd="cssa2022";
    $dbhost="140.116.154.84:27017";
    require '..\vendor\autoload.php';

    $client=new MongoDB\Client("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");

    $collection =$client->JavascriptParser->moduleschemas;
    $deleteResult = $collection->deleteMany(['path' => 'index.js']);

    printf("Deleted %d document(s)\n", $deleteResult->getDeletedCount());

?>