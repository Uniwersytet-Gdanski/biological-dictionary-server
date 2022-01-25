const workful = require("workful");
const lang = require("../../src/modules/lang.js");
const auth = require("../../auth.json");
const config = require("../../config.json");

const {
	POST,
} = workful.methodsSymbols;

const fs = require("fs/promises");


const router = {
	[POST]: async (req, res) => {
		if (req.getHeader("authorization") !== auth.deployToken) {
			return res.setStatusCode(401).end(lang("deploy.unauthorized"));
		}
		const {websiteDirectory} = config;
		if (!(await fs.access(websiteDirectory).then(() => (true)).catch(() => (false)))) {
			return res.setStatusCode(201).end("OK");
		}
		await fs.readdir(websiteDirectory).then(async (relativeFilepaths) => {
			await Promise.all(relativeFilepaths.map(async (relativeFilepath) => (
				fs.rm(websiteDirectory + "/" + relativeFilepath, {recursive: true})
			)));
		});
		return res.setStatusCode(201).end("OK");
		
	},
};

module.exports = router;
