const startMongoose = require("./src/modules/startMongoose.js");
const enableTimedConsoleLogs = require("./src/utils/enableTimedConsoleLogs.js");
const entriesManager = require("./src/modules/entriesManager.js");
const startServer = require("./src/modules/startServer.js");
const lang = require("./src/modules/lang.js");

(async () => {
	enableTimedConsoleLogs();
	await startMongoose().then(() => {
		console.log(lang("log.connectedToMongoDb"));
	});
	await entriesManager.fetchAll().then((entries) => {
		console.log(lang("log.fetchedEntries", entries));
	});
	await startServer().then((server) => {
		console.log(lang("log.serverStarted", server));
	});
})();
