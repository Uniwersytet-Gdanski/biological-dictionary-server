const workful = require("workful");

const {
	GET,
} = workful.methodsSymbols;


const entriesManager = require("../../modules/entriesManager.js");

const router = {
	[GET]: (req, res) => {
		const firstLetters = entriesManager.getAll().reduce((firstLetters, entry) => {
			for (const name of entry.names) {
				firstLetters.add(name[0].toLowerCase());
			}
			return firstLetters;
		}, new Set());
		res.setStatusCode(200).endJson(
			Array.from(firstLetters).sort(
				(firstLetter1, firstLetter2) => (firstLetter1.localeCompare(firstLetter2))
			)
		);
	},
};

module.exports = router;
