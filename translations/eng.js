module.exports = {
	log: {
		connectedToMongoDb: "Connected to MongoDB.",
		syncedTerms: (terms) => (`Synced ${terms.length} terms.`),
		serverStarted: (server) => (`Server started on port ${server.address().port}.`),
	},
	session: {
		noSessionTokenProvided: "No session token provided.",
		invalidSessionToken: "Invalid session token.",
	},
	terms: {
		termNotFound: (termId) => (`Term not found: ${termId}`),
		termAlreadyExists: (termId) => (`Term already exists: ${termId}`),
		syncStarted: "Terms sync started.",
		syncFinished: "Terms sync finished.",
	},
	login: {
		wrongCredentials: "Wrong credentials.",
	},
	requestLimiter: {
		tooManyRequests: "Too many requests.",
	},
	deploy: {
		unauthorized: "Unauthorized.",
	},
};
