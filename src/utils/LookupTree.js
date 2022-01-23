const latinize = require("latinize");

const calculatePermutations = (array) => {
	if (array.length == 0) return [];
	if (array.length == 1) return [array];
	return array.flatMap((element, i) => (
		calculatePermutations(array.slice(0, i).concat(array.slice(i + 1))).map((permutation) => [element].concat(permutation))
	));
};

class Node {
	nodeByCharacter = {};
	entries = [];
}

class LookupTree {
	#rootNode = new Node();
	#sanitizeQuery(query) {
		return latinize(query.replace(/[^\w]+/g, " ").trim().toLowerCase());
	}
	#addToNode(node, entry, query) {
		node.entries.push(entry);
		if (query.length == 0) {
			return;
		}
		const queryHead = query[0];
		const queryTail = query.slice(1);
		if (!node.nodeByCharacter[queryHead]) {
			const nodeTo = new Node();
			node.nodeByCharacter[queryHead] = nodeTo;
		}
		this.#addToNode(node.nodeByCharacter[queryHead], entry, queryTail);
	}
	addEntry(entry) {
		const sanitizedQuery = this.#sanitizeQuery(entry.query);
		const sanitizedQueryPermutations = calculatePermutations(sanitizedQuery.split(" ")).map((permutation) => (permutation.join(" ")));
		for (const sanitizedQueryPermutation of sanitizedQueryPermutations) {
			this.#addToNode(this.#rootNode, entry, sanitizedQueryPermutation);
		}
	}
	addEntries(entries) {
		for (const entry of entries) {
			this.addEntry(entry);
		}
	}
	// removeEntry(entry) {  // TODO
	// 	const sanitizedQuery = this.#sanitizeQuery(entry.query);
	// 	const sanitizedQueryPermutations = calculatePermutations(sanitizedQuery.split(" ")).map((permutation) => permutation.join(" "));
	// 	for (const sanitizedQueryPermutation of sanitizedQueryPermutations) {
	// 		this.#removeFromNode(this.#rootNode, entry, sanitizedQueryPermutation);
	// 	}
	// }
	// removeEntries(entries) {
	// 	for (const entry of entries) {
	// 		this.removeEntry(entry);
	// 	}
	// }
	constructor(entries = []) {
		this.addEntries(entries);
	}
	#search(node, matchByEntry, query, score) {
		if (score < 0.5) return;

		if (query.length == 0) {
			for (const entry of node.entries) {
				const match = {
					score,
					entry,
				};
				if (matchByEntry.has(entry) && matchByEntry.get(entry).score >= match.score) continue;
				matchByEntry.set(entry, match);
			}
			return;
		}
		const queryHead = query[0];
		const queryTail = query.slice(1);
		if (queryHead in node.nodeByCharacter) {
			this.#search(node.nodeByCharacter[queryHead], matchByEntry, queryTail, score);
		}
		for (const character in node.nodeByCharacter) {
			if (character === queryHead) continue;
			this.#search(node.nodeByCharacter[character], matchByEntry, query, score * 0.8);
		}
		this.#search(node, matchByEntry, queryTail, score * 0.8);
	}
	search(query) {
		const matchByEntry = new Map();
		const sanitizedQuery = this.#sanitizeQuery(query);
		this.#search(this.#rootNode, matchByEntry, sanitizedQuery, 1);
		return Array.from(matchByEntry.values()).sort((match1, match2) => (match2.score - match1.score || ((query.length - match2.entry.query.length) - (query.length - match1.entry.query.length))));
	}
}


module.exports = LookupTree;
