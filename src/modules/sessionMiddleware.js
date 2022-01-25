const Session = require("../../models/Session.js");
const lang = require("./lang.js");


const sessionMiddleware = async (req, res, data, next) => {
	const sessionTokenCookie = req.getCookie("sessionToken");
	if (!sessionTokenCookie) {
		return res.setStatusCode(401).endText(lang("session.noSessionTokenProvided"));
	}
	const session = await Session.findOne({
		token: sessionTokenCookie.value,
	});
	if (!session) {
		return res.setStatusCode(401).endText(lang("session.invalidSessionToken"));
	}
	data.session = session;
	await next();
};

module.exports = sessionMiddleware;
