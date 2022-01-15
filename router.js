const workful = require("workful");

const {
	POST,
} = workful.methodsSymbols;

const deployMiddleware = require("./modules/deployMiddleware.js");

const router = [
	workful.middlewares.cors,
	deployMiddleware.post,
	deployMiddleware.get,
	{
		"api": require("./api/router.js"),
		"clear-deploy": {
			[POST]: deployMiddleware.clear,
		},
	},
];

module.exports = router;
