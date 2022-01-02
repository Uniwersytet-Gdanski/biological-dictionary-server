const connectingMongoose = require("./modules/connectingMongoose.js");
const {logStdout, logStderr} = require("./utils/timeLog.js");

connectingMongoose.then(() => {
	logStdout(`Connected to MongoDB.`);
}).catch((err) => {
	logStderr(err);
	process.exit(1);
});
