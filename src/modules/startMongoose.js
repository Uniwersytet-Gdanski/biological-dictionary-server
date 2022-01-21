const mongoose = require("mongoose");
mongoose.plugin((schema) => {
	schema.options.minimize = false;
	schema.options.toJSON = {
		virtuals: true,
		versionKey: false,
		transform: (doc, obj)=>{
			obj.id = obj._id;
			delete obj._id;
		},
	};
	schema.virtual("id").set(function(value) {
		this._id = value;
	}).get(function() {
		return this._id;
	});
});

const auth = require("../../auth.json").mongodb;

const startMongoose = () => (mongoose.connect(`mongodb://${auth.username}:${auth.password}@${auth.host}:${auth.port}/${auth.database}${"replicaSet" in auth ? `?replicaSet=${auth.replicaSet}` : ""}`));

module.exports = startMongoose;
