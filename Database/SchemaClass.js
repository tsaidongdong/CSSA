const mongoose = require("mongoose");


class CustomSchema {
	/**
	 * @returns {MongooseSchema}
	 */
	getMongoSchema() {
		// TODO: 家佑
		let keys = Object.keys(this);
		let schema = {};	
		keys.forEach(key => {
			schema[key] = this[key];
		});

		return schema;
	}
}

class DescriptionSchema extends CustomSchema {
	// 描述內容 (首行內容)
	description = {type: String, required: true};
	// 描述內容 (更多內容)
	moreDescription = {type: String};
	// 更新作者
	updatedBy = {type: [String], required: true, default: []};
	// 是否測試中
	isBeta = {type: Boolean, required: true, default: false};
	// 是否目前為預留用途
	isReserved = {type: Boolean, required: true, default: false};
	// 是否已經被遺棄
	isDeprecated = {type: Boolean, required: true, default: false};
	// 更新日期
	updatedDate = {type: String, required: true};
	// 是否有tags
	tags = {type: [String], required: true, default: []} 
}

class IdentifyingObject extends CustomSchema {
	// 物件描述
	description = new DescriptionSchema().getMongoSchema();
	// 物件名稱
	name = {type: String, required: true};
	// 物件出現的行數
	lineNo = {type: String, required: true};
}

class VariableSchema extends CustomSchema {
	// 資料型態
	type = {type: String, required: true};
	// 描述
	description = {type: String, required: true};
}

class ParameterSchema extends VariableSchema {
	// 參數名稱
	name = {type: String, required: true};
	// 參數預設值/預設 expression
	default = {type: String, required: true};
	// 是否其餘參數 (JS: function funtionName(...rest) / Python: def function_name(*rest))
	isRest = {type: Boolean, required: true, default: false};
	// 是否kwargs (Python only: def function_name(**kwargs))
	isKwargs = {type: Boolean, required: true, default: false};
}

class FunctionSchema extends IdentifyingObject {
	// 函式參數
	parameters = {type: [new ParameterSchema().getMongoSchema()], default: []};
	// 函式回傳
	returns = {type: [new VariableSchema().getMongoSchema()], default: []};
	// 函式生成
	yields = {type: [new VariableSchema().getMongoSchema()], default: []};
	// 是否生成器
	isGenerator = {type: Boolean, required: true, default: false};
	// 是否 async
	isAsync = {type: Boolean, required: true, default: false};
}

class MethodSchema extends FunctionSchema {
	// 是否 get 方法
	isGet = {type: Boolean, required: true, default: false};
	// 是否 set 方法
	isSet = {type: Boolean, required: true, default: false};
	// 是否 magic 方法 (Python only)
	isMagic = {type: Boolean, required: true, default: false};
	// 是否建構式
	isConstructor = {type: Boolean, required: true, default: false};
	// 是否靜態
	isStatic = {type: Boolean, required: true, default: false};
	// 是否私有
	isPrivate = {type: Boolean, required: true, default: false};
}

class EnumValueSchema extends IdentifyingObject {
	// 參數 Enumeration 值
	value = {type: String, required: true};
	// 資料型態
	type = {type: String, required: true};
}

class EnumerationSchema extends IdentifyingObject {
	// 本 enumeration 有的值
	values = {type: [new EnumValueSchema().getMongoSchema()], default: []};
	// 本 enumeration 有的方法
	methods = {type: [new MethodSchema().getMongoSchema()], default: []};
}

class FieldSchema extends IdentifyingObject {
	// 資料型態
	type = {type: String, required: true};
	// 參數預設值/預設 expression
	default = {type: String, required: true};
	// 是否靜態
	isStatic = {type: Boolean, required: true, default: false};
	// 是否私有
	isPrivate = {type: Boolean, required: true, default: false};
}

class ClassSchema extends IdentifyingObject {
	// 延伸的 class
	extends = {type: String};
	// 本類別的 inner classes
	innerClasses = {type: [mongoose.ObjectId], default: []};
	// 本類別的 Enumerations
	enumerations = {type: [new EnumerationSchema().getMongoSchema()], default: []};
	// 本類別有的方法
	methods = {type: [new MethodSchema().getMongoSchema()], default: []};
	// 本類別有的欄位
	fields = {type: [new FieldSchema().getMongoSchema()], default: []};
}

/** Module Schema - 一個獨立的 js 模組檔/python 模組資料夾或模組檔 */
class ModuleSchema extends CustomSchema {
	// 程式碼資料夾路徑
	path = {type: String, required: true};
	// 對本文件的描述
	description = new DescriptionSchema().getMongoSchema();
	// 底下的 Module (Python only - 資料夾)
	subModules = {type: [mongoose.ObjectId], default: []};
	// 使用者定義之 import 物件
	imports = {type: [mongoose.ObjectId], default: []};
	// 本模組提供的 class.
	classes = [new ClassSchema().getMongoSchema()];
	// 本模組提供的 functions.
	functions = [new FunctionSchema().getMongoSchema()];
	// 本模組提供的 enumerations.
	enumerations = [new EnumerationSchema().getMongoSchema()];
	// 需要 export 的項目 (JS only).
	exports = {type: [mongoose.ObjectId], default: []};
	// 預設 export 的項目 (JS only).
	defaultExport = {type: mongoose.ObjectId};
}

/** Global Schema */
class GlobalSchema extends CustomSchema {
	// 程式碼資料夾路徑
	path = {type: String, required: true};
	// 對本文件的描述
	description = new DescriptionSchema().getMongoSchema();
	// 需要使用者定義之 global modules;
	modules = [new ModuleSchema().getMongoSchema()];
}

var globals = new ModuleSchema();
//console.log(globals.getMongoSchema());
module.export = mongoose.model('moduleSchema', new ModuleSchema().getMongoSchema() )
