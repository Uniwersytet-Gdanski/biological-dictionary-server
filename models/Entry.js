const {Schema, model} = require("mongoose");
const entrySchema = new Schema({
	_id: String,
	names: [String],
	englishTerms: [{
		_id: false,
		singular: String,
		plural: String,
	}],
	definition: String,
});

module.exports = model("Entry", entrySchema, "entries");
