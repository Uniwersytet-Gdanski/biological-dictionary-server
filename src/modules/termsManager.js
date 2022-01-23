const TermsManager = require("../utils/TermsManager.js");
const config = require("../../config.json");
const Term = require("../../models/Term.js");

const termsManager = new TermsManager(Term, config.termsSyncInterval);

module.exports = termsManager;


// 	addToTree = function(term) {
// 		this.#terms.set(term.id, term);
// 		this.#lookupTree.addTerm(term);
// 	};
// 	fetchAll = async function() {
// 		return Term.find({}).then((terms) => {
// 			for (const term of terms) {
// 				this.addToTree(term.toJSON());
// 			}
// 			return terms;
// 		});
// 	};
// 	fetchById = async function(id) {
// 		return Term.findById(id).then((term) => {
// 			if (term) this.addToTree(term.toJSON());
// 			return term;
// 		});
// 	};
// 	getAll = function() {
// 		return Array.from(this.#terms.values());
// 	};
// 	deleteById = async function(id) {
// 		await Term.findByIdAndDelete(id).then((term) => {
// 			if (term) this.#terms.delete(term.id);
// 		});
// 	};
// 	getById = function(id) {
// 		return this.#terms.get(id);
// 	};
// 	search = function(query) {
// 		return this.#lookupTree.search(query);
// 	};
// 	add = async function(term) {
// 		return Term.create(term).then((term) => {
// 			return term;
// 		});
// 	};
// }

// const termsManager = new TermsManager();

// module.exports = termsManager;
