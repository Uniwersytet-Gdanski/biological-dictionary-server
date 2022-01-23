const yup = require("yup");
const workful = require("workful");
const paginate = require("../../src/modules/paginate.js");

const {
	GET,
} = workful.methodsSymbols;

const {maxPageSize} = require("../../config.json");




const queryParamsSchema = yup.object().shape({
	query: yup.string().required(),
	withFullTerms: yup.boolean().nullable().default(false).transform((value) => (value === null ? true : value)),
	withoutDuplicates: yup.boolean().nullable().default(false).transform((value) => (value === null ? true : value)),
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
});

const termsManager = require("../../src/modules/termsManager.js");

const router = {
	[GET]: [
		workful.middlewares.yup.validateQueryParams(queryParamsSchema),
		paginate(async (req) => {
			const {
				query,
				pageNumber,
				pageSize,
				withFullTerms: isWithFullTerms,
				withoutDuplicates: isWithoutDuplicates,
			} = await queryParamsSchema.validate(req.getQueryParams());
			const searchResults = ((searchResults) => (isWithoutDuplicates ? searchResults.reduce((acc, searchResult) => {
				const {searchResults, usedIds} = acc;
				if (!usedIds.has(searchResult.id)) {
					usedIds.add(searchResult.id);
					searchResults.push(searchResult);
				}
				return acc;
			}, {searchResults: [], usedIds: new Set()}).searchResults : searchResults))(termsManager.search(query));
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(searchResults.length / pageSize),
				data: searchResults.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map((searchResults) => ({
					id: searchResults.id,
					name: searchResults.name,
					score: searchResults.score,
					...(isWithFullTerms && {term: searchResults.term}),
				})),
			};
		})
	],
};

module.exports = router;
