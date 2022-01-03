const {Schema, model} = require("mongoose");
const entrySchema = new Schema({
	_id: String,
	adminId: String,
	token: {
		type: String,
		unique: true,
	},
	expireTimestamp: Number,
});

module.exports = model("Entry", entrySchema, "entries");
