const workful = require("workful");

const {
	GET,
} = workful.methodsSymbols;

const router = {
	[GET]: async (req, res, {termsManager}) => {
		const firstLetters = termsManager.getAll().reduce((firstLetters, term) => {
			for (const name of term.names) {
				firstLetters.add(name[0].toLowerCase());
			}
			return firstLetters;
		}, new Set());
		return res.setStatusCode(200).endJson(
			Array.from(firstLetters).sort(
				(firstLetter1, firstLetter2) => (firstLetter1.localeCompare(firstLetter2))
			)
		);
	},
};

module.exports = router;
