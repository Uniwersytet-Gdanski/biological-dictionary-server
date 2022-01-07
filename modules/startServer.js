const workful = require("workful");
const config = require("../config.json");
const router = require("../router.js");

const startServer = () => (new Promise((resolve, reject) => {
	const server = workful.createServer(router);
	server.listen(config.port);
	server.on("listening", () => {
		resolve(server);
	});
	server.on("error", (error) => {
		reject(error);
	});
}));

module.exports = startServer;