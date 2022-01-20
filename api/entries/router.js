const workful = require("workful");
const paginate = require("../../src/modules/paginate.js");
const entriesManager = require("../../src/modules/entriesManager.js");
const sessionMiddleware = require("../../src/modules/sessionMiddleware.js");
const yup = require("yup");

const {maxPageSize} = require("../../config.json");

const {
	GET,
	POST,
} = workful.methodsSymbols;


const postBodySchema = yup.object().shape({
	names: yup.array().of(yup.string().required()).required().min(1),
	definition: yup.string().required(),
	englishTerms: yup.array().of(yup.object().shape({
		singular: yup.string().required(),
		plural: yup.string().required(),
	})).required().min(1),
});

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
			const entries = entriesManager.getAll();
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(entries.length / pageSize),
				data: entries.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		})
	],
	[POST]: [
		sessionMiddleware,
		workful.middlewares.jsonBody,
		workful.middlewares.yup.validateJsonBody(postBodySchema),
		async (req, res, data) => {
			const jsonBody = await postBodySchema.validate(data.jsonBody);
			return entriesManager.add(jsonBody).then((entry) => {
				return res.setStatusCode(200).endJson(entry);
			}).catch((error) => {
				if (error.code === 11000) return res.setStatusCode(409).end(`Entry with id "${jsonBody.names[0].toLowerCase().replace(/ /g, "-")}" already exists`);
				throw error;
			});
		},
	],
	":": require("./entryId/router.js"),
};

module.exports = router;
