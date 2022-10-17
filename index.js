const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

require('./Api/parserApi')(app)
//call api

app.listen(3000);

app.get('/*', (req, res) => {
	console.log("URL:")
	console.log(req.originalUrl);

	fs.readFile('./docUI.html', (err, data) => {
		res.writeHead(200, {"Content-type": "text/html"});
		res.end(data);
	});
});

app.post('/submit', (req, res) => {
	console.log(req.body);
	res.status(200).send("dkjkquygj");
})
// post - ajax呼叫 bodyparser傳資料

