const Session = require("../../models/Session.js");
const lang = require("./lang.js");


const sessionMiddleware = async (req, res, data, next) => {
	const sessionToken = req.getCookie("sessionToken");
	if (!sessionToken) {
		return res.setStatusCode(401).endText(lang("errors.session.noSessionTokenProvided"));
	}
	const session = await Session.findOne({
		token: sessionToken,
	});
	if (!session) {
		return res.setStatusCode(401).endText(lang("errors.session.invalidSessionToken"));
	}
	data.session = session;
	await next();
};

module.exports = sessionMiddleware;
