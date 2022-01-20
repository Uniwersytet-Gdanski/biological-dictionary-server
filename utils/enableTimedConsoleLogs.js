const getLogTextTimestamp = () => {
	const now = new Date();
	const textTimestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
	return `[${textTimestamp}]`;
};

const enableTimedConsoleLogs = () => {
	const log = console.log;
	console.log = (...args) => (
		log(getLogTextTimestamp(), ...args)
	);
	const error = console.error;
	console.error = (...args) => (
		error(getLogTextTimestamp(), ...args)
	);
	const warn = console.warn;
	console.warn = (...args) => (
		warn(getLogTextTimestamp(), ...args)
	);
	const info = console.info;
	console.info = (...args) => (
		info(getLogTextTimestamp(), ...args)
	);
};

module.exports = enableTimedConsoleLogs;
