const {Schema, model} = require("mongoose");
const adminCredentialsSchema = new Schema({
	_id: String,
	login: {
		type: String,
		unique: true,
	},
	hash: String,
});

module.exports = model("AdminCredentials", adminCredentialsSchema, "adminsCredentials");
