const {Schema, model} = require("mongoose");
const entrySchema = new Schema({
	_id: String,
	login: {
		type: String,
		unique: true,
	},
	hash: String,
});

module.exports = model("Entry", entrySchema, "entries");
