const workful = require("workful");
const sessionMiddleware = require("../../../src/modules/sessionMiddleware.js");
const lang = require("../../../src/modules/lang.js");
const termNameToId = require("../../../src/utils/termNameToId.js");

const {
	GET,
	DELETE,
	PUT,
} = workful.methodsSymbols;

const termSchema = require("../termSchema.js");

const getTermMiddleware = async (req, res, data, next) => {
	const {termsManager} = data;
	const termId = req.getPathParam("termId");
	const term = termsManager.getById(termId);
	if (!term) {
		res.setStatusCode(404).endText(lang("terms.termNotFound", termId));
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
			async (req, res, {termsManager, term}) => {
				return termsManager.delete(term).then(() => {
					return res.setStatusCode(204).end();
				});
			},
		],
		[PUT]: [
			sessionMiddleware,
			getTermMiddleware,
			workful.middlewares.jsonBody,
			workful.middlewares.yup.validateJsonBody(termSchema),
			async (req, res, {termsManager, term, yupJsonBody}) => {
				const newTermId = termNameToId(yupJsonBody.names[0]);
				return termsManager.update(term, {id: newTermId, ...yupJsonBody}).then((newTerm) => {
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
