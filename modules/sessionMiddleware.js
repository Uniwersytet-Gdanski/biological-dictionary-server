const Session = require("../models/Session.js");


const sessionMiddleware = async (req, res, data, next) => {
	const sessionToken = req.getCookie("sessionToken");
	if (!sessionToken) {
		return res.setStatusCode(401).endText("Unauthorized, invalid session id");
	}
	const session = await Session.findOne({
		token: sessionToken,
	});
	if (!session) {
		return res.setStatusCode(401).endText("Unauthorized, no such session");
	}
	data.session = session;
	await next();
};

module.exports = sessionMiddleware;
