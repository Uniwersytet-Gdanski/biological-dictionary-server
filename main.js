const startMongoose = require("./modules/startMongoose.js");
const enableTimedConsoleLogs = require("./utils/enableTimedConsoleLogs.js");
const entriesManager = require("./modules/entriesManager.js");
const startServer = require("./modules/startServer.js");

(async () => {
	enableTimedConsoleLogs();
	await startMongoose().then(() => {
		console.log(`Connected to MongoDB.`);
	});
	await entriesManager.fetchAll().then((entries) => {
		console.log(`Fetched ${entries.length} entries.`);
	});
	await startServer().then((server) => {
		console.log(`Server started on port ${server.address().port}.`);
	});
})();
