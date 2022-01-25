const startMongoose = require("./src/modules/startMongoose.js");
const enableTimedConsoleLogs = require("./src/utils/enableTimedConsoleLogs.js");
const startTermsManager = require("./src/modules/startTermsManager.js");
const startServer = require("./src/modules/startServer.js");
const lang = require("./src/modules/lang.js");

(async () => {
	enableTimedConsoleLogs();
	const mongoose = await startMongoose().then((mongoose) => {
		console.log(lang("log.connectedToMongoDb"));
		return mongoose;
	});
	const termsManager = await startTermsManager(mongoose);
	await termsManager.sync().then(() => {
		console.log(lang("log.syncedTerms", termsManager.getAll()));
	});
	await startServer(termsManager).then((server) => {
		console.log(lang("log.serverStarted", server));
	});
})();
