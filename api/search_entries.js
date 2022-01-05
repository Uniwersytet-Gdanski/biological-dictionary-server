const workful = require("workful");

const {
	GET,
} = workful.symbols;

// const {createGetFromQuery} = workful;


const entriesManager = require("../entriesManager.js");

const router = {
	[GET]: (req, res) => {
		const {query} = req.getQuery() || {};
		if (query === undefined) {
			res.status(400).endText("Bad Request, no query provided");
			return;
		}
		res.endJson(entriesManager.search(query));
	}
};

module.exports = router;
