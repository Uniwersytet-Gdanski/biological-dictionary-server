const workful = require("workful");

const {
	POST,
} = workful.methodsSymbols;

const deployMiddleware = require("./src/modules/deployMiddleware.js");

const router = [
	workful.middlewares.cors,
	deployMiddleware.get,
	{
		"api": require("./api/router.js"),
		"clear-deploy": {
			[POST]: deployMiddleware.clear,
		},
		"deploy": [
			deployMiddleware.post,
		],
	},
];

module.exports = router;
