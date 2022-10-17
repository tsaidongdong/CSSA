<?php

    $user="cssa2022js_parser";
    $pwd="cssa2022";
    $dbhost="140.116.154.84:27017";
    
    require '..\vendor\autoload.php';

    $client=new MongoDB\Client("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");

    $collection =$client->JavascriptParser->moduleschemas;
    $array = array(); 
    $cursor = $collection->find([]);

    foreach ($cursor as $document) {
        //echo json_encode($document);
        //array_push($array, $document['path']); 
        //echo $document['_id'], "\n";
        //echo json_encode($document['_id']), "\n";
        echo ($document);
        
    }

    //var_dump($document);
    //echo json_encode($document);
    //echo json_encode($array);
    //print($cursor);

    
    /*$cursor = $collection->find(['path' => 'index.js']);
    foreach ($cursor as $document) {
        echo $document['_id'], "\n";
    }*/
    //echo "PARSER\n";
    /*$cursor = $collection->find(['path' => 'parserApi.js']);
    foreach ($cursor as $document) {
        echo $document['_id'], "\n";
    }*/

    /*foreach($client->listDatabases() as $db){
        var_dump($db);
    }*/
 
    /*//echo "function connect \n";
    $manager = new MongoDB\Driver\Manager("mongodb://cssa2022js_parser:cssa2022@140.116.154.84:27017/JavascriptParser");
    
    # setting your options and filter
    $filter  = [];
    $options = [];
    
    #constructing the querry
    $query = new MongoDB\Driver\Query($filter, $options);

    #executing
    $cursor = $manager->executeQuery('JavascriptParser.moduleschemas', $query);

    echo "dumping results<br>";
    foreach ($cursor as $document) {
        var_dump($document);
    }*/
?>