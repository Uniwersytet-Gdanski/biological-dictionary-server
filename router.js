const workful = require("workful");

const {
	POST,
} = workful.methodsSymbols;

const deployMiddleware = require("./modules/deployMiddleware.js");

const router = [
	workful.middlewares.cors,
	deployMiddleware.get,
	{
		"api": require("./api/router.js"),
		"deploy": {
			[POST]: deployMiddleware.post,
		},
		"clear-deploy": {
			[POST]: deployMiddleware.clear,
		},
	},
];

module.exports = router;
