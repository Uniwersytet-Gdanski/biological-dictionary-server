const config = require("../config.json");

const paginate = (getPage) => async (req, res) => {

	// const {
	// 	invalidPageNumber: invalidPageNumberCallback = (req, res) => {
	// 		
	// 	},
	// 	invalidPageSize: invalidPageSizeCallback = (req, res) => {
	// 		
	// 	},
	// } = callbacks;
	const pageNumber = Number(req.getQueryParam("pageNumber", "1") || undefined);
	const pageSize = Number(req.getQueryParam("pageSize", "10") || undefined);
	// "|| undefined" is needed to convert an empty string to undefined
	// so that passing no value to the query parameter will result in 400 Bad Request


	const page = await getPage(req, res, {pageNumber, pageSize});
	if (!page) {
		return res.setStatusCode(400).end();
	}
	const baseUrl = `${config.baseUrl}/${req.getDividedPath().join("/")}`;
	res.setStatusCode(200).endJson({
		...page,
		nextPageUrl: pageNumber < page.pagesCount ? `${baseUrl}?${req.rebuildQuery({pageNumber: pageNumber + 1})}` : null,
		previousPageUrl: pageNumber > 1 ? `${baseUrl}?${req.rebuildQuery({pageNumber: pageNumber - 1})}` : null,
	});
};

module.exports = paginate;
