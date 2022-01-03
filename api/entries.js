const workful = require("workful");

const {
	GET,
} = workful.symbols;

const {createGetFromQuery} = workful;

const stringifyQuery = (query) => (
	Object.entries(query).map(([key, value]) => (`${key}=${value}`)).join("&")
);


const fakeData = [
	{
		"id": "aberracja-chromatyczna",
		"names": ["aberracja chromatyczna"],
		"englishTerms": [
			{
				"singular": "chromatic aberration",
				"plural": "chromatic aberrations",
			},
			{
				"singular": "chromatic distortion",
				"plural": "chromatic distortions",
			},
			{
				"singular": "spherochromaticism",
				"plural": "spherochromaticisms",
			},
		],
		"definition": "An optical aberration occuring when a lens does not focus all colours in one place",
	},
	{
		"id": "aborcja",
		"names": ["aborcja"],
		"englishTerms": [
			{
				"singular": "abortion",
				"plural": "abortions",
			},
		],
		"definition": "A termination of pregnancy by outside factors.",
	},
];



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
		const page = fakeData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
		const fragment = req.getFragment();
		const totalPages = Math.ceil(fakeData.length / pageSize);
		// todo: https in urls
		// todo: fragment doesnt work
		console.log(pageNumber, pageSize, totalPages);
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
