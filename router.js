const {
	POST,
} = require("workful").methodsSymbols;

const deployMiddleware = require("./modules/deployMiddleware.js");

const router = [
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
