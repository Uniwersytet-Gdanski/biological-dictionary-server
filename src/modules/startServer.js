const workful = require("workful");
const config = require("../../config.json");
const router = require("../../router.js");
const requestLoggerMiddleware = require("./requestLoggerMiddleware.js");
const requestLimiterMiddleware = require("./requestLimiterMiddleware.js");



const startServer = (termsManager) => (new Promise((resolve, reject) => {
	const server = workful.createServer([
		async (req, res, data) => {
			data.termsManager = termsManager;
		},
		requestLimiterMiddleware,
		requestLoggerMiddleware,
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