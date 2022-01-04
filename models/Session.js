const {Schema, model} = require("mongoose");
const sessionSchema = new Schema({
	_id: String,
	adminId: String,
	token: {
		type: String,
		unique: true,
	},
	expireTimestamp: Number,
});

module.exports = model("Session", sessionSchema, "sessions");
