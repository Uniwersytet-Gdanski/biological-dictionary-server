const workful = require("workful");
const paginate = require("../../modules/paginate.js");

const {
	GET,
	DELETE,
	POST,
} = workful.methodsSymbols;

const yup = require("yup");

const postBodySchema = yup.object().shape({
	names: yup.array().of(yup.string().required()).required().min(1),
	definition: yup.string().required(),
	englishTerms: yup.array().of(yup.object().shape({
		singular: yup.string().required(),
		plural: yup.string().required(),
	})).required(),
});

const entriesManager = require("../../modules/entriesManager.js");

const sessionMiddleware = require("../../modules/sessionMiddleware.js");

const {maxPageSize} = require("../../config.json");

const queryParamsSchema = yup.object().shape({
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
});

const yupValidationErrorHandler = require("../../modules/yupValidationErrorHandler.js");

const router = {
	[GET]: [
		yupValidationErrorHandler,
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
		yupValidationErrorHandler,
		async (req, res, data) => {
			const jsonBody = await postBodySchema.validate(data.jsonBody);
			await entriesManager.add(jsonBody).then((entry) => {
				res.setStatusCode(200).endJson(entry);
			}).catch((error) => {
				if (error.code === 11000) return res.setStatusCode(409).end(`Entry with id "${jsonBody.names[0].toLowerCase().replace(/ /g, "-")}" already exists`);
				throw error;
			});
		},
	],
	":": [
		"entryId",
		{
			[GET]: (req, res) => {
				const entryId = req.getPathParam("entryId");
				const entry = entriesManager.getById(entryId);
				if (!entry) {
					res.setStatusCode(404).endText("Not Found, entry not found");
					return;
				}
				res.setStatusCode(200).endJson(entry);
			},
			[DELETE]: [
				sessionMiddleware,
				async (req, res) => {
					const entryId = req.getPathParam("entryId");
					const entry = entriesManager.getById(entryId);
					if (!entry) {
						res.setStatusCode(404).endText("Not Found, entry not found");
						return;
					}
					await entriesManager.deleteById(entryId);
					res.setStatusCode(204).end();
				},
			],
		},
	],
};

module.exports = router;
