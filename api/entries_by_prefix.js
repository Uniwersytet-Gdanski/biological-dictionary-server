const workful = require("workful");
const paginate = require("../modules/paginate.js");

const {
	GET,
	ANY_SUBROUTE,
	PATH_PARAM_NAME,
} = workful.symbols;

const entriesManager = require("../modules/entriesManager.js");


const router = {
	[GET]: paginate((req, res, {pageNumber, pageSize}) => {
		if (isNaN(pageNumber)) return null;
		if (isNaN(pageSize)) return null;
		const prefix = req.getQueryParam("prefix");
		if (prefix == null) {
			res.setStatusCode(400).end();
			return null
		}
		const entries = entriesManager.getAll().reduce((entries, entry) => {
			for (const name of entry.names) {
				if (!name.startsWith(prefix)) continue;
				entries.push({
					id: entry.id,
					name: name,
				});
			}
			return entries;
		}, []);

		return {
			pageNumber,
			pageSize,
			pagesCount: Math.ceil(entries.length / pageSize),
			data: entries.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
		};
	}),
	[ANY_SUBROUTE]: {
		[PATH_PARAM_NAME]: "entryId",
		[GET]: (req, res) => {
			const entryId = req.getPathParam("entryId");
			const entry = entriesManager.getById(entryId);
			if (!entry) {
				res.setStatusCode(404).endText("Not Found, entry not found");
				return;
			}
			res.setStatusCode(200).endJson(entry);
		},
	},

};

module.exports = router;
