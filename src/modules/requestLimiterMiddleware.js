const config = require("../../config.json");
const lang = require("../../src/modules/lang.js");

const lastRequestsCountByAddress = new Map();

const {refreshInterval} = config.requestLimiter;

const refresh = () => {
	for (const [address, count] of lastRequestsCountByAddress) {
		if (count === 1) lastRequestsCountByAddress.delete(address);
		else lastRequestsCountByAddress.set(address, count - 1);
	}
};

setInterval(refresh, refreshInterval * 1000);

const requestLimiterMiddleware = async (req, res, data, next) => {
	console.log(lastRequestsCountByAddress);
	const address = req.getHeader("real-remote-address") || req.socket.remoteAddress;
	if (lastRequestsCountByAddress.get(address) >= 100) {
		return res.setHeader("retry-after", Math.ceil(refreshInterval)).setStatusCode(429).endText(lang("requestLimiter.tooManyRequests"));
	} else {
		lastRequestsCountByAddress.set(address, (lastRequestsCountByAddress.get(address) || 0) + 1);
		await next();
	}
};

module.exports = requestLimiterMiddleware;
