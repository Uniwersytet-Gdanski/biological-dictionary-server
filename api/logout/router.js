const workful = require("workful");
const sessionMiddleware = require("../../src/modules/sessionMiddleware.js");


const {
	POST,
} = workful.methodsSymbols;


const router = {
	[POST]: [
		sessionMiddleware,
		async (req, res, {session}) => {
			await session.remove().then(() => {
				res.setStatusCode(204).setCookie("sessionToken", "", {
					["max-age"]: 0,
				}).setCookie("sessionId", "", {
					["max-age"]: 0,
				}).end();
			});
		},
	],
};

module.exports = router;
