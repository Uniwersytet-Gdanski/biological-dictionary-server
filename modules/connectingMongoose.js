const mongoose = require("mongoose");
mongoose.plugin((schema) => {
	schema.options.minimize = false;
	schema.options.toJSON = {
		virtuals: true,
		versionKey: false,
		transform: (doc, obj)=>{
			obj.id = obj._id;
			delete obj._id;
		}
	};
});

const auth = require("../auth.json").mongodb;


module.exports = mongoose.connect(`mongodb://${auth.username}:${auth.password}@${auth.host}:${auth.port}/${auth.database}${"replicaSet" in auth ? `?replicaSet=${auth.replicaSet}` : ""}`).then(()=>(mongoose));
