const {
	GET,
} = require("workful").symbols;

const router = {
	[GET]: (req, res) => {
		res.endText("Hello, world!");
	},
	"api": require("./api/router.js"),
};

module.exports = router;