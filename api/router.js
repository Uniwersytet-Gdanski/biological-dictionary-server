const router = {
	"search-terms": require("./search_terms/router.js"),
	"terms": require("./terms/router.js"),
	"terms-by-prefix": require("./terms_by_prefix/router.js"),
	"login": require("./login/router.js"),
	"terms-first-letters": require("./terms_first_letters/router.js"),
	"logout": require("./logout/router.js"),
	"deploy": require("./deploy/router.js"),
	"clear-deploy": require("./clear_deploy/router.js"),
};

module.exports = router;
