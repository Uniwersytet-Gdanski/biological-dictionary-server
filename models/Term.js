const {Schema, model} = require("mongoose");
const termSchema = new Schema({
	_id: String,
	names: [String],
	englishTranslations: [{
		_id: false,
		singular: String,
		plural: String,
	}],
	definition: String,
});

module.exports = model("Term", termSchema, "terms");
