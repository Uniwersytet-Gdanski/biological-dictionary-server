const {
	GET,
	MIDDLEWARE,
	POST,
} = require("workful").symbols;

const deployMiddleware = require("./modules/deployMiddleware.js");

const router = {
	[GET]: (req, res) => {
		res.endText("Hello, world!");
	},
	"api": require("./api/router.js"),
	[MIDDLEWARE]: deployMiddleware.get,
	"deploy": {
		[MIDDLEWARE]: deployMiddleware.post,
	},
	"clear-deploy": {
		[POST]: deployMiddleware.clear,
	},
};

module.exports = router;
