module.exports = {
	log: {
		connectedToMongoDb: "Connected to MongoDB.",
		fetchedTerms: (terms) => (`Fetched ${terms.length} terms.`),
		serverStarted: (server) => (`Server started on port ${server.address().port}.`),
	},
	errors: {
		noSessionTokenProvided: "No session token provided.",
		invalidSessionToken: "Invalid session token.",
		termNotFound: (termId) => (`Term not found: ${termId}`),
	},
	login: {
		wrongCredentials: "Wrong credentials.",
	},
};
