const config = require("../../config.json");
const {language} = config;
const translation = require(`../../translations/${language}.js`);

class LangError extends Error {
	constructor(path) {
		super(`"${path}" is not a valid path for lanuage "${language}"`);
		this.langPath = path;
		this.name = this.constructor.name;
	}
}
  

const lang = (path, payload) => {
	try {
	let currentTranslation = translation;
	const pathParts = path.split(".");
	for (const pathParth of pathParts) {
		try {
			currentTranslation = currentTranslation[pathParth];
		} catch {
			throw new LangError(path);
		}
	}
	if (typeof currentTranslation === "string") {
		return currentTranslation;
	}
	if (typeof currentTranslation === "function") {
		return currentTranslation(payload);
	}
	throw new LangError(path);
	} catch (error) {
		if (error instanceof LangError) return error.langPath;
		throw error;
	}
};

module.exports = lang;
