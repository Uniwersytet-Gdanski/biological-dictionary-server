const startMongoose = require("./src/modules/startMongoose.js");
const enableTimedConsoleLogs = require("./src/utils/enableTimedConsoleLogs.js");
const termsManager = require("./src/modules/termsManager.js");
const startServer = require("./src/modules/startServer.js");
const lang = require("./src/modules/lang.js");

(async () => {
	enableTimedConsoleLogs();
	await startMongoose().then(() => {
		console.log(lang("log.connectedToMongoDb"));
	});
	await termsManager.fetchAll().then((terms) => {
		console.log(lang("log.fetchedTerms", terms));
	});
	await startServer().then((server) => {
		console.log(lang("log.serverStarted", server));
	});
})();
