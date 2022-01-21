const fileByPath = new Map();

const fs = require("fs/promises");
const fsSync = require("fs");
const auth = require("../../auth.json");

const getMimeType = require("../utils/getMimeType.js");
const getFileExtension = require("../utils/getFileExtension.js");

const fsReaddirSyncRecursive = (path) => {
	const files = [];
	const _fsReaddirSyncRecursive = (basePath, relativePath, files) => {
		for (const filename of fsSync.readdirSync(basePath + relativePath)) {
			if (fsSync.statSync(basePath + relativePath + filename).isDirectory()) {
				_fsReaddirSyncRecursive(basePath, relativePath + filename + "/", files);
			}
			else {
				files.push(relativePath.slice(1) + filename);
			}
		}
	};
	_fsReaddirSyncRecursive(path, "/", files);
	return files;
};

const fsWriteFileSyncRecursive = (path, content) => {
	const dividedPath = path.split("/").slice(0, -1);
	let currentPath = "";
	for (const relativePath of dividedPath) {
		currentPath += relativePath + "/";
		if (!fsSync.existsSync(currentPath)) {
			fsSync.mkdirSync(currentPath);
		}
	}
	fsSync.writeFileSync(path, content);
};




if (fsSync.existsSync("./build")) for (const filepath of fsReaddirSyncRecursive("./build")) {
	const extension = getFileExtension(filepath);
	const mimeType = getMimeType(extension);
	fileByPath.set(filepath, {
		mimeType,
		content: fsSync.readFileSync("./build/" + filepath),
	});
}



const deployMiddlewarePost = async (req, res) => {
	if (req.method !== "POST") {
		return res.setStatusCode(405).send("Method not allowed");
	}
	if (req.getHeader("authorization") !== auth.deployToken) {
		return res.setStatusCode(401).end("Invalid deploy token");
	}
	return req.getBody().then((body) => {
		const filepath = req.getDividedPath().slice(1).join("/");
		const extension = getFileExtension(filepath);
		const file = {
			mimeType: getMimeType(extension),
			content: body,
		};
		fileByPath.set(filepath, file);
		fsWriteFileSyncRecursive("./build/" + filepath, file.content);
		res.setStatusCode(201).end("OK");
	});
};

const deployMiddlewareGet = async (req, res, data, next) => {
	const filepath = req.getDividedPath().join("/");
	if (req.getDividedPath()[0] === "api") return await next();
	const extension = getFileExtension(filepath);
	if (req.method !== "GET") return res.setStatusCode(405).end();
	const file = fileByPath.get(filepath);
	const indexFile = fileByPath.get("index.html");
	if (file) return res.setHeader("content-type", file.mimeType).end(file.content);
	if (!indexFile) return res.setStatusCode(404).end();
	if ([undefined, "html", "htm"].includes(extension)) return res.setHeader("content-type", indexFile.mimeType).end(indexFile.content);
	return res.setStatusCode(404).end();
};

const deployMiddlewareClear = (req, res) => {
	if (req.getHeader("authorization") !== auth.deployToken) {
		return res.setStatusCode(401).end();
	}
	fileByPath.clear();
	fs.access("./build").then(() => {
		fs.readdir("./build").then((filepaths) => {
			for (const filepath of filepaths) {
				fs.rm("./build/" + filepath, {recursive: true});
			}
		}).catch(() => {});
	}).catch(() => {});
	return res.setStatusCode(202).end();
};


module.exports = {
	post: deployMiddlewarePost,
	get: deployMiddlewareGet,
	clear: deployMiddlewareClear,
};
