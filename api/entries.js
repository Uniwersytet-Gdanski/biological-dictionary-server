const {
	GET,
} = require("workful").symbols;

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
		const {
			pageNumber: rawPageNumber,
			pageSize: rawPageSize,
			...queryRest
		} = req.getQuery() || {};
		const pageNumber = rawPageNumber === undefined ? 1 : Number(rawPageNumber || undefined);
		if (isNaN(pageNumber) || !Number.isInteger(pageNumber) || pageNumber < 1) {
			res.status(400).endText("Bad Request, no valid pageNumber provided");
			return;
		}
		const pageSize = rawPageSize === undefined ? 10 : Number(rawPageSize || undefined);
		if (isNaN(pageSize) || !Number.isInteger(pageSize) || pageSize > 50 || pageSize < 1) {
			res.status(400).endText("Bad Request, no valid pageSize provided");
			return;
		}
		const page = fakeData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
		const strigifiedQueryRest = Object.entries(queryRest).map(([key, value]) => (`${key}=${value}`)).join("&");
		const fragment = req.getFragment();
		const totalPages = Math.ceil(fakeData.length / pageSize);
		// todo: https in urls
		res.endJson({
			data: page,
			pageNumber,
			pageSize,
			totalPages,
			nextPageUrl: pageNumber < totalPages ? `http${""}://${req.getHeader("host")}/api/entries?pageNumber=${pageNumber + 1}&pageSize=${pageSize}${strigifiedQueryRest ? `&${strigifiedQueryRest}` : ""}${fragment == undefined ? "" : `#${fragment}`}` : null,
			previousPageUrl: pageNumber > 1 ? `http${""}://${req.getHeader("host")}/api/entries?pageNumber=${pageNumber - 1}&pageSize=${pageSize}${strigifiedQueryRest ? `&${strigifiedQueryRest}` : ""}${fragment == undefined ? "" : `#${fragment}`}` : null,
		});
	}
};

module.exports = router;
