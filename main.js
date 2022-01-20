const startMongoose = require("./modules/startMongoose.js");
const enableTimedConsoleLogs = require("./utils/enableTimedConsoleLogs.js");
const entriesManager = require("./modules/entriesManager.js");
const startServer = require("./modules/startServer.js");
const lang = require("./lang.js");

(async () => {
	enableTimedConsoleLogs();
	await startMongoose().then(() => {
		console.log(lang.log.connectedToMongoDb);
	});
	await entriesManager.fetchAll().then((entries) => {
		console.log(lang.log.fetchedEntries(entries));
	});
	await startServer().then((server) => {
		console.log(lang.log.serverStarted(server));
	});
})();
