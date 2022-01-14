const router = {
	"search-entries": require("./search_entries/router.js"),
	"entries": require("./entries/router.js"),
	"entries-by-prefix": require("./entries_by_prefix/router.js"),
	"login": require("./login/router.js"),
};

module.exports = router;
