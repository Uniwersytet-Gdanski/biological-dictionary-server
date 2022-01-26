const yup = require("yup");

const termSchema = yup.object().shape({
	names: yup.array().of(yup.string().required()).required().min(1),
	definition: yup.string().required(),
	englishTranslations: yup.array().of(yup.object().shape({
		singular: yup.string().nullable().defined(),
		plural: yup.string().nullable().defined(),
	})).required().min(1),
});

module.exports = termSchema;
