const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;

class CustomSchema {
	/**
	 * @returns {MongooseSchema}
	 */
	getMongoSchema() {
		let keys = Object.keys(this);
		let schema = {};	
		keys.forEach(key => {
			schema[key] = this[key];
		});
		return schema;
	}
}

class TagSchema extends CustomSchema {
	// tag name
	name = {type: String, require: true};
	methods = {type: [new MethodSchema().getMongoSchema()], default: []};
}

class MethodSchema extends CustomSchema {
	// path
	path = {type: String, require: true};
	// method name
	name = {type: String, require: true};
	// description
	description = {type: String, required: true};
	// return type
	returnType = {type: String};
	// 是否靜態
	isStatic = {type: Boolean, required: true, default: false};
	// 是否私有
	isPrivate = {type: Boolean, required: true, default: false};
}

module.export = mongoose.model('tagSchema', new TagSchema().getMongoSchema());