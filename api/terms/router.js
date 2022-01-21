const workful = require("workful");
const paginate = require("../../src/modules/paginate.js");
const termsManager = require("../../src/modules/termsManager.js");
const sessionMiddleware = require("../../src/modules/sessionMiddleware.js");
const yup = require("yup");

const {maxPageSize} = require("../../config.json");

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
		paginate(async (req) => {
			const {
				pageNumber,
				pageSize,
			} = await queryParamsSchema.validate(req.getQueryParams());
			const terms = termsManager.getAll();
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(terms.length / pageSize),
				data: terms.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		})
	],
	[POST]: [
		sessionMiddleware,
		workful.middlewares.jsonBody,
		workful.middlewares.yup.validateJsonBody(termSchema),
		async (req, res, data) => {
			const jsonBody = await termSchema.validate(data.jsonBody);
			return termsManager.add(jsonBody).then((term) => {
				return res.setStatusCode(200).endJson(term);
			}).catch((error) => {
				if (error.code === 11000) return res.setStatusCode(409).end(`Term with id "${jsonBody.names[0].toLowerCase().replace(/ /g, "-")}" already exists`);
				throw error;
			});
		},
	],
	":": require("./termId/router.js"),
};

module.exports = router;
