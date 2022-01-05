const workful = require("workful");

const {
	GET,
} = workful.symbols;

const {createGetFromQuery} = workful;

const entriesManager = require("../entriesManager.js");

const stringifyQuery = (query) => (
	Object.entries(query).map(([key, value]) => (`${key}=${value}`)).join("&")
);

const router = {
	[GET]: (req, res) => {
		const query = req.getQuery();
		const getFromQuery = createGetFromQuery(query);
		const pageNumber = getFromQuery.integer("pageNumber", 1);
		const pageSize = getFromQuery.integer("pageSize", 10);

		if (isNaN(pageNumber) || pageNumber < 1) {
			res.status(400).endText("Bad Request, no valid pageNumber provided");
			return;
		}
		if (isNaN(pageSize) || pageSize > 50 || pageSize < 1) {
			res.status(400).endText("Bad Request, no valid pageSize provided");
			return;
		}
		const data = entriesManager.getAll();

		const page = data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
		const fragment = req.getFragment();
		const totalPages = Math.ceil(data.length / pageSize);
		// todo: https in urls
		// todo: fragment doesnt work
		// console.log(pageNumber, pageSize, totalPages);
		// todo, nie działa pageSize i pageNumber
		res.endJson({
			data: page,
			pageNumber,
			pageSize,
			totalPages,
			nextPageUrl: pageNumber < totalPages ? `http${""}://${req.getHeader("host")}/api/entries?${stringifyQuery({...query, pageNumber: pageNumber + 1, pageSize})}${fragment == undefined ? "" : `#${fragment}`}` : null,
			previousPageUrl: pageNumber > 1 ? `http${""}://${req.getHeader("host")}/api/entries?${stringifyQuery({...query, pageNumber: pageNumber - 1, pageSize})}${fragment == undefined ? "" : `#${fragment}`}` : null,
		});
	}
};

module.exports = router;
