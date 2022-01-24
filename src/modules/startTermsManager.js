const TermsManager = require("../utils/TermsManager.js");
const config = require("../../config.json");
const Term = require("../../models/Term.js");

const startTermsManager = (mongoose) => (new TermsManager(mongoose, Term, config.terms.syncInterval));

module.exports = startTermsManager;
