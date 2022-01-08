const workful = require("workful");
const config = require("../config.json");
const router = require("../router.js");
const {logStdout} = require("../utils/timeLog.js");

const startCallback = (req, res) => {
	res.setHeader("access-control-allow-origin", "*");
	logStdout(`${req.method} ${req.getPath()}`);
};

const startServer = () => (new Promise((resolve, reject) => {
	const server = workful.createServer(router, {
		startCallback,
	});
	server.listen(config.port);
	server.on("listening", () => {
		resolve(server);
	});
	server.on("error", (error) => {
		reject(error);
	});
}));

module.exports = startServer;