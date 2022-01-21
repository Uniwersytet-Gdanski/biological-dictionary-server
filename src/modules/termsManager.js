const Term = require("../../models/Term.js");
const latinize = require("latinize");
const calculatePermutations = require("../utils/calculatePermutations.js");

class Node {
	nodeByCharacter = {};
	matches = [];
}

class LookupTree {
	#rootNode = new Node();
	#sanitizeWord(word) {
		return latinize(word.trim().toLowerCase().replace(/[^\w]+/g, " "));
	}
	#addToNode(node, query, match) {
		node.matches.push(match);
		if (query.length == 0) {
			return;
		}
		const character = query[0];
		if (!node.nodeByCharacter[character]) {
			const nodeTo = new Node();
			node.nodeByCharacter[character] = nodeTo;
		}
		this.#addToNode(node.nodeByCharacter[character], query.slice(1), match);
	}
	addTerm(term) {
		for (const name of term.names) {
			const sanitizedName = this.#sanitizeWord(name);
			for (const dividedSanitizedPermutedName of calculatePermutations(sanitizedName.split(" "))) {
				const sanitizedPermutedName = dividedSanitizedPermutedName.join(" ");

				this.#addToNode(this.#rootNode, sanitizedPermutedName, {
					id: term.id,
					name,
					term,
				});
			}
		}
	}

	constructor(terms = []) {
		for (const term of terms) {
			this.addTerm(term);
		}
	}
	#search(node, query, matchByName, score) {
		if (score < 0.5) return;

		if (query.length == 0) {
			for (const match of node.matches) {
				if (!(match.name in matchByName) || matchByName[match.name].score < score) {
					matchByName[match.name] = {
						score,
						...match
					};
				}
			}
			return;
		}
		const head = query[0];
		const tail = query.slice(1);
		if (head in node.nodeByCharacter) {
			this.#search(node.nodeByCharacter[head], tail, matchByName, score);
		}
		for (const character in node.nodeByCharacter) {
			this.#search(node.nodeByCharacter[character], query, matchByName, score * 0.8);
		}
		this.#search(node, tail, matchByName, score * 0.8);
	}
	search(query) {
		const matchByName = {};
		const sanitizedQuery = this.#sanitizeWord(query);
		this.#search(this.#rootNode, sanitizedQuery, matchByName, 1);
		return Object.values(matchByName).sort((match1, match2) => match2.score - match1.score);
	}
}


class TermsManager {
	#terms = new Map();
	#lookupTree = new LookupTree();
	addToTree = function(term) {
		this.#terms.set(term.id, term);
		this.#lookupTree.addTerm(term);
	};
	fetchAll = async function() {
		return Term.find({}).then((terms) => {
			for (const term of terms) {
				this.addToTree(term.toJSON());
			}
			return terms;
		});
	};
	fetchById = async function(id) {
		return Term.findById(id).then((term) => {
			if (term) this.addToTree(term.toJSON());
			return term;
		});
	};
	getAll = function() {
		return Array.from(this.#terms.values());
	};
	deleteById = async function(id) {
		await Term.findByIdAndDelete(id).then((term) => {
			if (term) this.#terms.delete(term.id);
		});
	};
	getById = function(id) {
		return this.#terms.get(id);
	};
	search = function(query) {
		return this.#lookupTree.search(query);
	};
	add = async function(term) {
		return Term.create(term).then((term) => {
			return term;
		});
	};
}

const termsManager = new TermsManager();

module.exports = termsManager;
