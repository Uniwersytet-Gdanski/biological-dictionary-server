const {Schema, model} = require("mongoose");
const {v4: uuidv4} = require("uuid");


const sessionSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4,
	},
	adminId: String,
	token: {
		type: String,
		unique: true,
	},
	expireTimestamp: Number,
});

module.exports = model("Session", sessionSchema, "sessions");
