const latinize = require("latinize");

const termNameToId = (termName) => (latinize(termName.toLowerCase()).replace(/[^\w]+/g, " ").trim().replace(/\s+/g, "-"));

module.exports = termNameToId;
