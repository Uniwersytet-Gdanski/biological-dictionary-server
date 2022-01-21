const {Schema, model} = require("mongoose");


const sessionSchema = new Schema({
	_id: {
		type: String,
	},
	adminId: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		unique: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
});

// sessionSchema.index({"expiresAt": 1}, {expireAfterSeconds: 1});

module.exports = model("Session", sessionSchema, "sessions");
