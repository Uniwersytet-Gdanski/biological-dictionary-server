const workful = require("workful");
const config = require("../config.json");
const router = require("../router.js");
// const {logStdout} = require("../utils/timeLog.js");

const startServer = () => (new Promise((resolve, reject) => {
	const server = workful.createServer(router, [
		workful.middlewares.cors,
		router,
	]);
	server.listen(config.port);
	server.on("listening", () => {
		resolve(server);
	});
	server.on("error", (error) => {
		reject(error);
	});
}));

module.exports = startServer;