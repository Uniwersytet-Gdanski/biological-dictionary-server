const workful = require("workful");
const {
	POST,
} = workful.methodsSymbols;

const yup = require("yup");

const bodySchema = yup.object().shape({
	login: yup.string().required(),
	password: yup.string().required(),
});

const router = {
	// [POST]: [
	// 	workful.middlewares.jsonBody,
	// 	async (req, res) => {
	// 		const castedBody = await bodySchema.validate(await req.getBody());
	// 		res.setStatusCode(200).endText("abc");
	// 	},
	// ],
};

module.exports = router;
