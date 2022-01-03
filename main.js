const connectingMongoose = require("./modules/connectingMongoose.js");
const {logStdout, logStderr} = require("./utils/timeLog.js");
const workful = require("workful");
const config = require("./config.json");
const router = require("./router.js");

connectingMongoose.then(() => {
	logStdout(`Connected to MongoDB.`);
	const server = workful.createServer(router);
	server.listen(config.port);
	server.on("listening", () => {
		logStdout(`HTTP server listening on port ${server.address().port}.`);
	});
}).catch((err) => {
	logStderr(err);
	process.exit(1);
});
