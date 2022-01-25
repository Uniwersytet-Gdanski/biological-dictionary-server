const workful = require("workful");
const yup = require("yup");
const paginate = require("../../src/modules/paginate.js");

const {maxPageSize} = require("../../config.json").paging;
const {
	GET,
} = workful.methodsSymbols;

const queryParamsSchema = yup.object().shape({
	prefix: yup.string().nullable().test("is-not-null", "prefix is required", (value) => (value != null)).lowercase(),
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
	withFullTerms: yup.boolean().nullable().default(false).transform((value) => (value === null ? true : value)),
});

const router = {
	[GET]: [
		workful.middlewares.yup.validateQueryParams(queryParamsSchema),
		paginate(async (req, res, {termsManager, yupQueryParams}) => {
			const {
				prefix,
				pageNumber,
				pageSize,
				withFullTerms: isWithFullTerms,
			} = yupQueryParams;
			console.log(`terms_by_prefix/router.js: GET: ${prefix}`);
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
				estimatedDataCount: terms.length,
				pagesCount: Math.ceil(terms.length / pageSize),
				data: terms.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		}),
	],
};

module.exports = router;
