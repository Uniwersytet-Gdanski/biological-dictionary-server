const workful = require("workful");
const config = require("../config.json");

const {
	GET,
	ANY_SUBROUTE,
	PATH_PARAM_NAME,
} = workful.symbols;

const entriesManager = require("../modules/entriesManager.js");


const router = {
	[GET]: (req, res) => {
		const pageNumber = Number(req.getQueryParam("pageNumber", "1") || undefined);
		const pageSize = Number(req.getQueryParam("pageSize", "10") || undefined);
		// "|| undefined" is needed to convert an empty string to undefined
		// so that passing no value to the query parameter will result in 400 Bad Request
		// /api/entries?pageNumber= -> 400 Bad Request (pageNumber exists but is an empty string)
		// /api/entries -> 200 OK (uses the default values)
		// /api/entries?pageNumber -> 200 OK (uses the default values)
		// /api/entries?pageNumber=1 -> 200 OK (uses the given value)

		if (isNaN(pageNumber) || pageNumber < 1) {
			res.setStatusCode(400).endText("Bad Request, no valid pageNumber provided");
			return;
		}
		if (isNaN(pageSize) || pageSize > 50 || pageSize < 1) {
			res.setStatusCode(400).endText("Bad Request, no valid pageSize provided");
			return;
		}
		const entries = entriesManager.getAll();

		const page = entries.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
		const pagesCount = Math.ceil(entries.length / pageSize);
		const baseUrl = `${config.protocol}://${config.host}:${config.port}/${req.getDividedPath().join("/")}`;
		res.setStatusCode(200).endJson({
			data: page,
			pageNumber,
			pageSize,
			pagesCount,
			nextPageUrl: pageNumber < pagesCount ? `${baseUrl}?${req.rebuildQuery({pageNumber: pageNumber + 1})}` : null,
			previousPageUrl: pageNumber > 1 ? `${baseUrl}?${req.rebuildQuery({pageNumber: pageNumber - 1})}` : null,
		});
	},
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
