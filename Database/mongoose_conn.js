//Import the mongoose module
var mongoose = require('mongoose');

function connect() {
    //Set up default mongoose connection
    var mongoDB = 'mongodb://cssa2022js_parser:cssa2022@140.116.154.84/JavascriptParser?retryWrites=true&w=majority';

    mongoose.connect(mongoDB);
    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

}

exports.connect = connect;