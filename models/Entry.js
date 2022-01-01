const {Schema, model} = require("mongoose");
const entrySchema = new Schema({
	_id: String,
});

module.exports = model("Entry", entrySchema, "entries");
