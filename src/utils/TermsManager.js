const LookupTree = require("./LookupTree.js");


class TermsManager {
	#lookupTree = new LookupTree();
	#terms = new Map();
	syncInterval = null;
	constructor(Term, termsSyncInterval) {
		this.Term = Term;
		this.syncInterval = setInterval(this.sync.bind(this), termsSyncInterval * 1000);
	}
	#updateLookupTree = function() {
		this.#lookupTree = new LookupTree();
		for (const term of this.#terms.values()) {
			for (const name of term.names) {
				this.#lookupTree.addEntry({
					result: term,
					query: name,
				});
			}
		}
	};

	postTerm = async function(term) {
		return this.Term.create(term).then((term) => {
			this.addTerm(term);
			return term;
		});
	};
	addTerm = async function(term) {
		this.#terms.set(term.id, term);
		this.#updateLookupTree();
	}
	addTerms = function(terms) {
		for (const term of terms) {
			this.#terms.set(term.id, term);
		}
		this.#updateLookupTree();
	};
	sync = async function() {
		await this.Term.find({}).then((fetchedTerms) => {
			this.#terms = new Map();
			this.addTerms(fetchedTerms);
		});
	}
	// fetchEntryById = async function(id) {
	// 	await Term.findById(id).then((fetchedTerm) => {
	// 		if (!fetchedTerm) return;
	// 		this.addTerm(fetchedTerm);
	// 	});
	// }
	getAll = function() {
		return Array.from(this.#terms.values());
	}

	getById = function(id) {
		return this.#terms.get(id);
	}

	removeById = async function(id) {
		if (!this.#terms.has(id)) return;
		return this.Term.findByIdAndDelete(id).then(() => {
			this.#terms.delete(id);
			this.#updateLookupTree();
		});
	}
	search = function(query) {
		return this.#lookupTree.search(query);
	}
}

module.exports = TermsManager;
