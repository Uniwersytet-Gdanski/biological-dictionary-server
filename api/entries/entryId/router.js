const workful = require("workful");
const entriesManager = require("../../../src/modules/entriesManager.js");
const sessionMiddleware = require("../../../src/modules/sessionMiddleware.js");
const lang = require("../../../src/modules/lang.js");

const {
	GET,
	DELETE,
} = workful.methodsSymbols;

const getEntryMiddleware = async (req, res, data, next) => {
	const entryId = req.getPathParam("entryId");
	const entry = entriesManager.getById(entryId);
	if (!entry) {
		res.setStatusCode(404).endText(lang("errors.entryNotFound", entryId));
		return;
	}
	data.entry = entry;
	await next();
};

const router = [
	"entryId",
	{
		[GET]: [
			getEntryMiddleware,
			async (req, res, {entry}) => {
				return res.setStatusCode(200).endJson(entry);
			},
		],
		[DELETE]: [
			sessionMiddleware,
			getEntryMiddleware,
			async (req, res, {entry}) => {
				await entriesManager.deleteById(entry.id);
				return res.setStatusCode(204).end();
			},
		],
	},
];

module.exports = router;
