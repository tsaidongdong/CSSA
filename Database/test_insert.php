<?php


    $user="cssa2022js_parser";
    $pwd="cssa2022";
    $dbhost="140.116.154.84:27017";
    require '..\vendor\autoload.php';

    $client=new MongoDB\Client("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");

    $collection =$client->JavascriptParser->moduleschemas;
    $insertManyResult = $collection->insertMany([
        [
            'username' => 'admin',
            'email' => 'admin@example.com',
            'name' => 'Admin User',
        ],
        [
            'username' => 'test',
            'email' => 'test@example.com',
            'name' => 'Test User',
        ],
    ]);

    printf("Inserted %d document(s)\n", $insertManyResult->getInsertedCount());

    var_dump($insertManyResult->getInsertedIds());
?>