module.exports = {
	log: {
		connectedToMongoDb: "Connected to MongoDB.",
		fetchedEntries: (entries) => (`Fetched ${entries.length} entries.`),
		serverStarted: (server) => (`Server started on port ${server.address().port}.`),
	},
	errors: {
		noSessionTokenProvided: "No session token provided.",
		invalidSessionToken: "Invalid session token.",
		entryNotFound: (entryId) => (`Entry not found: ${entryId}`),
	},
};
