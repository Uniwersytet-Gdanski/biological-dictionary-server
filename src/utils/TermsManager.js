const LookupTree = require("./LookupTree.js");


class TermsManager {
	#lookupTree = new LookupTree();
	#terms = new Map();
	syncInterval = null;
	constructor(mongoose, Term, termsSyncInterval) {
		this.mongoose = mongoose;
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

	post = async function(term) {
		return this.Term.create(term).then((term) => {
			this.#add(term);
			return term;
		});
	};
	#add = async function(term) {
		this.#terms.set(term.id, term);
		this.#updateLookupTree();
	}
	#addMany = function(terms) {
		for (const term of terms) {
			this.#terms.set(term.id, term);
		}
		this.#updateLookupTree();
	};
	sync = async function() {
		await this.Term.find({}).then((fetchedTerms) => {
			this.#terms = new Map();
			this.#addMany(fetchedTerms);
		});
	}

	getAll = function() {
		return Array.from(this.#terms.values());
	}

	getById = function(id) {
		return this.#terms.get(id);
	}

	delete = async function(term) {
		return term.delete().then(() => {
			this.#terms.delete(term.id);
			this.#updateLookupTree();
			return term;
		});
	}
	search = function(query) {
		return this.#lookupTree.search(query);
	}
	update = async function(term, newTerm) {
		const session = await this.mongoose.startSession();
		let updatedTermAcc;  // workaround for withTransaction doesnt returning updatedTerm
		return session.withTransaction(async () => {
			await term.delete({session});
			const [updatedTerm] = await this.Term.create([newTerm], {session});

			this.#terms.delete(term.id);
			this.#terms.set(updatedTerm.id, updatedTerm);
			this.#updateLookupTree();
			updatedTermAcc = updatedTerm;
			return;
		}).then(() => (updatedTermAcc));
	}
}

module.exports = TermsManager;
