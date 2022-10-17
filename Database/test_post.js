const request = require('request');

var json_data = {

    "_id": "628241e71b7eb73e24b6fdf",
    "description": {
        "updatedBy": [
            " "
        ],
        "isBeta": false,
        "isReserved": false,
        "isDeprecated": false,
        "tags": [

        ],
        "description": " ",
        "updatedDate": " "
    },
    "subModules": [

    ],
    "imports": [

    ],
    "exports": [

    ],
    "path": "parserApi.js",
    "classes": [

    ],
    "functions": [{
        "description": {
            "updatedBy": [

            ],
            "isBeta": false,
            "isReserved": false,
            "isDeprecated": false,
            "tags": [

            ],
            "description": "The api here will call the methods written in DBoperations.js.",
            "updatedDate": "no record"
        },
        "isGenerator": false,
        "isAsync": false,
        "_id": "628241e71b7eb73e24b6f4e0",
        "name": "apiFunc",
        "parameters": [{
            "isRest": false,
            "isKwargs": false,
            "_id": "628241e71b7eb73e24b6f4e1",
            "name": "app",
            "default": "Not Recorded",
            "type": "Not Recorded",
            "description": "Not Recorded"
        }],
        "lineNo": "parserApi.js Ln7",
        "returns": [

        ],
        "yields": [

        ]
    }],
    "enumerations": [

    ],
    "__v": 0

};

var options = {
    url: 'http://localhost:4000/test_query.php',
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    json: true,
    form: json_data
};

request.post(options, (err, res, body) => {
    var json_data;
    if (err) {
        return console.log(err);
    }
    console.log(res);
    json_data = JSON.stringify(res);
    //console.log(json_data);
    //console.log(`Status: ${res.statusCode}`);
    //data1 = JSON.parse(res);
    //console.log(json_data);
});


// request({
//     method: 'post',
//     url: 'http://localhost:4000/test_echo.php',
//     form: { name: 'hello', age: 25 },
//     headers: {
//         "content-type": "application/json"
//     },
//     json: true,
// }, function(error, response, body) {
//     //Print the Response
//     console.log(body);
// });

// var express = require("express");
// //const res = require('express/lib/response');
// var app = express();
// //app.use(express.json());


// // console.log('start app.post test')
// // app.post('localhost:4000/test_echo.php', function(req, res) {

// //     res.send('post request to php')
// // });
// // console.log('end app.post test')

// app.post('localhost:4000/test_echo.php', (req, res) => {
//     console.log(req.body);
//     res.send('post request to php')
// })

// function postToPHP(data) {
//     var http = require('http');

//     var options = {
//         host: 'localhost', //TODO
//         port: 4000, //TODO
//         path: '/test_echo.php', //TODO
//         method: 'POST',
//     };

//     // todo callback
//     callback = function(response) {
//         var str = '';
//         response.on('data', function(chunk) {

//             str += chunk;
//         });
//         response.on('end', function() {
//             console.log(str);
//         });
//     }

//     var reqPost = http.request(options, callback);
//     console.log("before write: " + data);
//     reqPost.write(data)
//     reqPost.end()
// };

// console.log("start post2php");
// postToPHP("test")
// console.log("end post2php ")