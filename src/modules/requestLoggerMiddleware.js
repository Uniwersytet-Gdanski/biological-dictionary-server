const requestLoggerMiddleware = (req) => {
	console.log(`(${req.socket.remoteAddress})`, req.method, "/" + req.getDividedPath().join("/"), JSON.stringify(req.getQueryParams()));
};

module.exports = requestLoggerMiddleware;
