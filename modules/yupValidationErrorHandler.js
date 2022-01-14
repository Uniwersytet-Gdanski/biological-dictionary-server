const yupValidationErrorHandler = async (req, res, data, next) => {
	try {
		await next();
	} catch (err) {
		if (err.name === "ValidationError") {
			res.setStatusCode(400).endText(err.message);
			return;
		}
		throw err;
	}
};

module.exports = yupValidationErrorHandler;
