const workful = require("workful");
const paginate = require("../../src/modules/paginate.js");
const sessionMiddleware = require("../../src/modules/sessionMiddleware.js");
const yup = require("yup");
const lang = require("../../src/modules/lang.js");
const termNameToId = require("../../src/utils/termNameToId.js");

const {maxPageSize} = require("../../config.json").paging;

const {
	GET,
	POST,
} = workful.methodsSymbols;


const termSchema = require("./termSchema.js");

const queryParamsSchema = yup.object().shape({
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
});

const router = {
	[GET]: [
		workful.middlewares.yup.validateQueryParams(queryParamsSchema),
		paginate(async (req, res, {termsManager, yupQueryParams}) => {
			const {
				pageNumber,
				pageSize,
			} = yupQueryParams;
			const terms = termsManager.getAll();
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				estimatedDataCount: terms.length,
				pagesCount: Math.ceil(terms.length / pageSize),
				data: terms.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		})
	],
	[POST]: [
		sessionMiddleware,
		workful.middlewares.jsonBody,
		workful.middlewares.yup.validateJsonBody(termSchema),
		async (req, res, {termsManager, yupJsonBody}) => {
			const newTermId = termNameToId(yupJsonBody.names[0]);
			return termsManager.post({id: newTermId, ...yupJsonBody}).then((term) => {
				return res.setStatusCode(200).endJson(term);
			}).catch((error) => {
				if (error.code === 11000) return res.setStatusCode(409).end(lang("terms.termAlreadyExists", {termId: yupJsonBody.id}));
				throw error;
			});
		},
	],
	":": require("./termId/router.js"),
};

module.exports = router;
