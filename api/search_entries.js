const workful = require("workful");

const {
	GET,
} = workful.symbols;

// const {createGetFromQuery} = workful;


const entriesManager = require("../modules/entriesManager.js");

const router = {
	[GET]: (req, res) => {
		const query = req.getQueryParam("query");
		if (query === undefined) {
			res.setStatusCode(400).endText("Bad Request, no query provided");
			return;
		}
		res.setStatusCode(200).endJson(entriesManager.search(query));
	}
};

module.exports = router;
