const getLogTextTimestamp = () => {
	const now = new Date();
	const textTimestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
	return `[${textTimestamp}]`;
};

const logStdout = (...args) => {
	console.log(getLogTextTimestamp(), ...args);
};

const logStderr = (...args) => {
	console.error(getLogTextTimestamp(), ...args);
};

module.exports = {
	logStdout,
	logStderr,
}
