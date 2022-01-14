const workful = require("workful");
const paginate = require("../../modules/paginate.js");

const {
	GET,
} = workful.methodsSymbols;

const maxPageSize = 30;

const yupValidationErrorHandler = require("../../modules/yupValidationErrorHandler.js");

const yup = require("yup");

const queryParamsSchema = yup.object().shape({
	query: yup.string().required(),
	withoutFullEntries: yup.boolean().nullable().transform((value) => (value === null ? true : value)),
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
});

const entriesManager = require("../../modules/entriesManager.js");

const router = {
	[GET]: [
		yupValidationErrorHandler,
		paginate(async (req) => {
			const {
				query,
				pageNumber,
				pageSize,
				withoutFullEntries: isWithoutFullEntries,
			} = await queryParamsSchema.validate(req.getQueryParams());
			const searchResults = entriesManager.search(query);
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(searchResults.length / pageSize),
				data: searchResults.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map((searchResults) => ({
					id: searchResults.id,
					name: searchResults.name,
					score: searchResults.score,
					...(!isWithoutFullEntries && {entry: searchResults.entry}),
				})),
			};
		})
	],
};

module.exports = router;
