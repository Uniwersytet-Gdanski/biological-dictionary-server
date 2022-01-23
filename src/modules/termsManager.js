const TermsManager = require("../utils/TermsManager.js");
const config = require("../../config.json");
const Term = require("../../models/Term.js");

const termsManager = new TermsManager(Term, config.terms.syncInterval);

module.exports = termsManager;
