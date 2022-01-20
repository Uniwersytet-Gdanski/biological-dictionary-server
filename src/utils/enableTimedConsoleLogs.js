const getLogTextTimestamp = () => {
	const now = new Date();
	const textTimestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
	return `[${textTimestamp}]`;
};

const log = console.log;
const error = console.error;
const warn = console.warn;
const info = console.info;

const enableTimedConsoleLogs = () => {
	console.log = (...args) => (
		log(getLogTextTimestamp(), ...args)
	);
	console.error = (...args) => (
		error(getLogTextTimestamp(), ...args)
	);
	console.warn = (...args) => (
		warn(getLogTextTimestamp(), ...args)
	);
	console.info = (...args) => (
		info(getLogTextTimestamp(), ...args)
	);
};

module.exports = enableTimedConsoleLogs;
