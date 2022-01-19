const {Schema, model} = require("mongoose");
const entrySchema = new Schema({
	_id: {
		type: String,
		default: function() {
			return this.names[0].toLowerCase().replace(/ /g, "-");
		}
	},
	names: [String],
	englishTerms: [{
		_id: false,
		singular: String,
		plural: String,
	}],
	definition: String,
});

module.exports = model("Entry", entrySchema, "entries");
