const config = require("../config.json");

const paginate = (getPage) => async (req, res, data) => {
	const page = await getPage(req, res, data);
	if (!page) {
		return res.setStatusCode(400).end();
	}
	const baseUrl = `${config.baseUrl}/${req.getDividedPath().join("/")}`;
	res.setStatusCode(200).endJson({
		...page,
		nextPageUrl: page.pageNumber < page.pagesCount ? `${baseUrl}?${req.rebuildQuery({pageNumber: page.pageNumber + 1})}` : null,
		previousPageUrl: page.pageNumber > 1 ? `${baseUrl}?${req.rebuildQuery({pageNumber: page.pageNumber - 1})}` : null,
	});
};

module.exports = paginate;
