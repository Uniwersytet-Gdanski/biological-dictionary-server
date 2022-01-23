const workful = require("workful");
const termsManager = require("../../../src/modules/termsManager.js");
const sessionMiddleware = require("../../../src/modules/sessionMiddleware.js");
const lang = require("../../../src/modules/lang.js");

const {
	GET,
	DELETE,
	PUT,
} = workful.methodsSymbols;

const termSchema = require("../termSchema.js");

const getTermMiddleware = async (req, res, data, next) => {
	const termId = req.getPathParam("termId");
	const term = termsManager.getById(termId);
	if (!term) {
		res.setStatusCode(404).endText(lang("errors.termNotFound", termId));
		return;
	}
	data.term = term;
	await next();
};

const router = [
	"termId",
	{
		[GET]: [
			getTermMiddleware,
			async (req, res, {term}) => {
				return res.setStatusCode(200).endJson(term);
			},
		],
		[DELETE]: [
			sessionMiddleware,
			getTermMiddleware,
			async (req, res, {term}) => {
				await termsManager.deleteById(term.id);
				return res.setStatusCode(204).end();
			},
		],
		[PUT]: [
			sessionMiddleware,
			workful.middlewares.jsonBody,
			workful.middlewares.yup.validateJsonBody(termSchema),
			async (req, res, {yupJsonBody}) => {
				await termsManager.updateById(yupJsonBody.id, yupJsonBody).then((newTerm) => {
					return res.setStatusCode(200).endJson(newTerm);
				}).catch((error) => {
					if (error.code === 11000) return res.setStatusCode(409).end(lang("terms.termAlreadyExists", {termId: yupJsonBody.id}));
					throw error;
				});
			}
		],
	},
];

module.exports = router;
