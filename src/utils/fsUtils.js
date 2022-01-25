const fs = require("fs/promises");


const writeFileRecursive = async (path, content) => {
	const dividedPath = path.split("/").slice(0, -1);
	let currentPath = "";
	for (const relativePath of dividedPath) {
		currentPath += relativePath + "/";
		if (!(await fs.access(currentPath).then(() => (true)).catch(() => (false)))) {
			await fs.mkdir(currentPath);
		}
	}
	await fs.writeFile(path, content);
};

module.exports = {
	writeFileRecursive,
};
