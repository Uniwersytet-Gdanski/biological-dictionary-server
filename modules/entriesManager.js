const Entry = require("../models/Entry.js");

const entriesManager = {
	_data: new Map(),
	add: function(entry) {
		this._data.set(entry.id, entry);
	},
	fetchAll: async function() {
		return Entry.find({}).then((entries) => {
			for (const entry of entries) {
				this.add(entry);
			}
			return entries;
		});
	},
	fetchById: async function(id) {
		return Entry.findById(id).then((entry) => {
			if (entry) this.add(entry);
			return entry;
		});
	},
	getAll: function() {
		return Array.from(this._data.values());
	},
	getById: function(id) {
		return this._data.get(id);
	},
	search: function(query) {
		const scoreByMatch = new Map();
		const matchByName = new Map();
		for (const entry of this._data.values()) {
			for (const name of entry.names) {
				const score = 1 / (1 + Math.abs(name.length - query.length));
				const match = matchByName.get(name);
				if (!match || scoreByMatch.get(match) < score) {
					const newMatch = {
						score,
						name,
						id: entry.id,
					};
					scoreByMatch.set(newMatch, score);
					matchByName.set(name, newMatch);
				}

			}
		}
		const matches = Array.from(scoreByMatch.keys());
		matches.sort((match1, match2) => match2.score - match1.score);
		return matches.slice(0, 10);
	},
};

module.exports = entriesManager;
