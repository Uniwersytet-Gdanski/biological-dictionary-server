const workful = require("workful");
const lang = require("../../src/modules/lang.js");
const auth = require("../../auth.json");
const config = require("../../config.json");
const fsUtils = require("../../src/utils/fsUtils.js");
const {
	POST,
} = workful.methodsSymbols;


const router = {
	[POST]: async (req, res) => {
		if (req.getHeader("authorization") !== auth.deployToken) {
			return res.setStatusCode(401).end(lang("deploy.unauthorized"));
		}
		const body = await req.getBody();
		const filepath = req.getHeader("x-filepath");
		await fsUtils.writeFileRecursive(config.websiteDirectory + "/" + filepath, body);
		return res.setStatusCode(201).end("OK");
	},
};

module.exports = router;
