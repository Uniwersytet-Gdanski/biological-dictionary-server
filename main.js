const startMongoose = require("./modules/startMongoose.js");
const {logStdout} = require("./utils/timeLog.js");
const entriesManager = require("./modules/entriesManager.js");
const startServer = require("./modules/startServer.js");

(async () => {
	await startMongoose().then(() => {
		logStdout(`Connected to MongoDB.`);
	});
	await entriesManager.fetchAll().then((entries) => {
		logStdout(`Fetched ${entries.length} entries.`);
	});
	await startServer().then((server) => {
		logStdout(`Server started on port ${server.address().port}.`);
	});
})();
