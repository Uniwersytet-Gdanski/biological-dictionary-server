const {
	GET,
	MIDDLEWARE,
	POST,
} = require("workful").symbols;

const deployMiddleware = require("./modules/deployMiddleware.js");

const router = {
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
