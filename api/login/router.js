const workful = require("workful");
const argon2 = require("argon2");
const AdminCredentials = require("../../models/AdminCredentials.js");
const Session = require("../../models/Session.js");
const config = require("../../config.json");
const crypto = require("crypto");
const {
	POST,
} = workful.methodsSymbols;

const yup = require("yup");

const bodySchema = yup.object().shape({
	login: yup.string().required(),
	password: yup.string().required(),
});

const router = {
	[POST]: [
		workful.middlewares.jsonBody,
		workful.middlewares.yup.validateJsonBody(bodySchema),
		async (req, res, data) => {
			const {
				login,
				password,
			} = await bodySchema.validate(data.jsonBody);
			const adminCredentials = await AdminCredentials.findOne({login});
			if (!adminCredentials) {
				res.setStatusCode(401).end("Invalid username");
				return;
			}
			const isValid = await argon2.verify(adminCredentials.hash, password);
			if (!isValid) {
				res.setStatusCode(401).end("Invalid password");
				return;
			}
			const session = await Session.create({
				adminId: adminCredentials.id,
				token: crypto.randomBytes(config.tokenLength).toString("hex"),
				expireTimestamp: Date.now() / 1000 + config.tokenValidityDuration,
			});
			res.setStatusCode(204).setCookie("sessionToken", session.token).setCookie("sessionId", session.id).end();
		},
	],
};

module.exports = router;
