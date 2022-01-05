const connectingMongoose = require("./modules/connectingMongoose.js");
const {logStdout, logStderr} = require("./utils/timeLog.js");
const workful = require("workful");
const config = require("./config.json");
const router = require("./router.js");
const entriesManager = require("./entriesManager.js");
const Entry = require("./models/Entry.js");

connectingMongoose.then(async () => {
	logStdout(`Connected to MongoDB.`);
	await Entry.find({}).then((entries) => {
		for (const entry of entries) {
			entriesManager.add(entry);
		}
	});
	logStdout(`Fake data loaded.`);
	const server = workful.createServer(router);
	server.listen(config.port);
	server.on("listening", () => {
		logStdout(`HTTP server listening on port ${server.address().port}.`);
	});
}).catch((err) => {
	logStderr(err);
	process.exit(1);
});
