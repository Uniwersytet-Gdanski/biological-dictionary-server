const {
	GET,
} = require("workful").symbols;

const router = {
	[GET]: (req, res) => {
		const {query} = req.getQuery() || {};
		if (query === undefined) {
			res.status(400).endText("Bad Request, no query provided");
			return;
		}
		res.endJson([
			{
				"id": "fermentacja-alkoholowa",
				"name": "fermentacja alkoholowa",
				"score": 0.9,
			},
		]);
	}
};

module.exports = router;
