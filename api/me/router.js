const workful = require("workful");
const {
	GET,
} = workful.methodsSymbols;

const sessionMiddleware = require("../../src/modules/sessionMiddleware.js");
const AdminCredentials = require("../../models/AdminCredentials.js");

const router = {
	[GET]: [
		sessionMiddleware,
		async (req, res, {session}) => {
			const adminCredentials = await AdminCredentials.findById(session.adminId);
			if (!adminCredentials) throw workful.errors.InternalError("Admin credentials not found");
			return res.setStatusCode(200).endJson({
				id: adminCredentials.id,
				login: adminCredentials.login,
			});
		},
	],
};

module.exports = router;
