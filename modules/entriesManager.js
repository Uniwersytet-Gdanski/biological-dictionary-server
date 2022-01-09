const Entry = require("../models/Entry.js");
const latinize = require("latinize");



class Node {
	nodeByCharacter = {};
	matches = [];
}

class LookupTree {
	#rootNode = new Node();
	#sanitizeWord(word) {
		return latinize(word.trim().toLowerCase().replace(/\s+/g, " "));
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
	addEntry(entry) {
		for (const name of entry.names) {
			const sanitizedName = this.#sanitizeWord(name);
			this.#addToNode(this.#rootNode, sanitizedName, {
				id: entry.id,
				name,
			});
		}
	}

	constructor(entries = []) {
		for (const entry of entries) {
			this.addEntry(entry);
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
		this.#search(this.#rootNode, query, matchByName, 1);
		return Object.values(matchByName).sort((match1, match2) => match2.score - match1.score);
	}
}


class EntriesManager {
	#entries = new Map();
	#lookupTree = new LookupTree();
	add = function(entry) {
		this.#entries.set(entry.id, entry);
		this.#lookupTree.addEntry(entry);
	};
	fetchAll = async function() {
		return Entry.find({}).then((entries) => {
			for (const entry of entries) {
				this.add(entry);
			}
			return entries;
		});
	};
	fetchById = async function(id) {
		return Entry.findById(id).then((entry) => {
			if (entry) this.add(entry);
			return entry;
		});
	};
	getAll = function() {
		return Array.from(this.#entries.values());
	};
	getById = function(id) {
		return this.#entries.get(id);
	};
	search = function(query, maxResults = 10) {
		return this.#lookupTree.search(query).slice(0, maxResults);
	};
}

const entriesManager = new EntriesManager();

module.exports = entriesManager;
