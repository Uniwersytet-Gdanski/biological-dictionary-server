const workful = require("workful");
const yup = require("yup");
const paginate = require("../../src/modules/paginate.js");

const {
	GET,
} = workful.methodsSymbols;

const {maxPageSize} = require("../../config.json");

const entriesManager = require("../../src/modules/entriesManager.js");




const queryParamsSchema = yup.object().shape({
	prefix: yup.string().required(),
	pageNumber: yup.number().integer().min(1).default(1),
	pageSize: yup.number().integer().min(1).max(maxPageSize).default(10),
	withoutFullEntries: yup.boolean().nullable().transform((value) => (value === null ? true : value)),
});

const router = {
	[GET]: [
		workful.middlewares.yup.validateQueryParams(queryParamsSchema),
		paginate(async (req) => {
			const {
				prefix,
				pageNumber,
				pageSize,
				withoutFullEntries: isWithoutFullEntries,
			} = await queryParamsSchema.validate(req.getQueryParams());
			const entries = entriesManager.getAll().reduce((entries, entry) => {
				for (const name of entry.names) {
					if (!name.startsWith(prefix)) continue;
					entries.push({
						id: entry.id,
						name: name,
						...(!isWithoutFullEntries && {entry}),
					});
				}
				return entries;
			}, []).sort((entry1, entry2) => (entry1.name.localeCompare(entry2.name)));
			return {
				pageNumber,
				pageSize,
				maxPageSize,
				pagesCount: Math.ceil(entries.length / pageSize),
				data: entries.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
			};
		})
	],
};

module.exports = router;
