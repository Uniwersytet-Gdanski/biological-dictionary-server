const workful = require("workful");
const yup = require("yup");
const paginate = require("../../src/modules/paginate.js");
const termsManager = require("../../src/modules/termsManager.js");

const {maxPageSize} = require("../../config.json");
const {
	GET,
} = workful.methodsSymbols;

const queryParamsSchema = yup.object().shape({
	prefix: yup.string().required().transform((value) => (value.toLowerCase())),
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
	withFullTerms: yup.boolean().nullable().default(false).transform((value) => (value === null ? true : value)),
});

const router = {
	[GET]: [
		workful.middlewares.yup.validateQueryParams(queryParamsSchema),
		paginate(async (req) => {
			const {
				prefix,
				pageNumber,
				pageSize,
				withFullTerms: isWithFullTerms,
			} = await queryParamsSchema.validate(req.getQueryParams());
			const terms = termsManager.getAll().reduce((terms, term) => {
				for (const name of term.names) {
					if (!name.toLowerCase().startsWith(prefix)) continue;
					terms.push({
						id: term.id,
						name: name,
						...(isWithFullTerms && {term}),
					});
				}
				return terms;
			}, []).sort((term1, term2) => (term1.name.localeCompare(term2.name)));
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(terms.length / pageSize),
				data: terms.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		}),
	],
};

module.exports = router;
