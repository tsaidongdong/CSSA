let DbOperation = require('../Database/DBoperation');
let dbOp = new DbOperation();

/*
 * The api here will call the methods written in DBoperations.js.
 */
function apiFunc(app) {
	app.post('/sendData', (req, res) => {
			dbOp.add(req.body, res);
	})
	app.post('/callData', (req, res) => {
		dbOp.find(req.body, res);
	})
	app.post('/getData', (req, res) => {
		dbOp.findAll(req.body, res);
	})
	app.post('/findById', (req, res) => {
		dbOp.findById(req.body, res);
	})
	app.post('/sendTags', (req, res) => {
		dbOp.addTag(req.body, res);
	})
	app.post('/getTags', (req, res) => {
		dbOp.getTags(req.body, res);
	})
}

module.exports = apiFunc;