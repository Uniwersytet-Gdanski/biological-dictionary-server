const fileByPath = new Map();

const fs = require("fs/promises");
const fsSync = require("fs");
const auth = require("../auth.json");

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



const mimeTypeByExtension = {
	"aac": "audio/aac",
	"abw": "application/x-abiword",
	"arc": "application/x-freearc",
	"avi": "video/x-msvideo",
	"azw": "application/vnd.amazon.ebook",
	"bin": "application/octet-stream",
	"bmp": "image/bmp",
	"bz": "application/x-bzip",
	"bz2": "application/x-bzip2",
	"csh": "application/x-csh",
	"css": "text/css",
	"csv": "text/csv",
	"doc": "application/msword",
	"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"eot": "application/vnd.ms-fontobject",
	"epub": "application/epub+zip",
	"gz": "application/gzip",
	"gif": "image/gif",
	"html": "text/html",
	"htm": "text/html",
	"ico": "image/vnd.microsoft.icon",
	"ics": "text/calendar",
	"jar": "application/java-archive",
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"js": "text/javascript",
	"json": "application/json",
	"jsonld": "application/ld+json",
	"midi": "audio/midi",
	"mid": "audio/midi",
	"mjs": "text/javascript",
	"mp3": "audio/mpeg",
	"mpeg": "video/mpeg",
	"mpkg": "application/vnd.apple.installer+xml",
	"odp": "application/vnd.oasis.opendocument.presentation",
	"ods": "application/vnd.oasis.opendocument.spreadsheet",
	"odt": "application/vnd.oasis.opendocument.text",
	"oga": "audio/ogg",
	"ogv": "video/ogg",
	"ogx": "application/ogg",
	"opus": "audio/opus",
	"otf": "font/otf",
	"png": "image/png",
	"pdf": "application/pdf",
	"php": "application/x-httpd-php",
	"ppt": "application/vnd.ms-powerpoint",
	"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"rar": "application/vnd.rar",
	"rtf": "application/rtf",
	"sh": "application/x-sh",
	"svg": "image/svg+xml",
	"swf": "application/x-shockwave-flash",
	"tar": "application/x-tar",
	"tif": "image/tiff",
	"tiff": "image/tiff",
	"ts": "video/mp2t",
	"ttf": "font/ttf",
	"txt": "text/plain",
	"vsd": "application/vnd.visio",
	"wav": "audio/wav",
	"weba": "audio/webm",
	"webm": "video/webm",
	"webp": "image/webp",
	"woff": "font/woff",
	"woff2": "font/woff2",
	"xhtml": "application/xhtml+xml",
	"xls": "application/vnd.ms-excel",
	"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"xul": "application/vnd.mozilla.xul+xml",
	"zip": "application/zip",
	"7z": "application/x-7z-compressed",
	"xml": "application/xml"
};

if (fsSync.existsSync("./build")) for (const filepath of fsReaddirSyncRecursive("./build")) {
	const extension = filepath.match(/\.([^./]*)$/)?.[1]?.toLowerCase();
	const mimeType = mimeTypeByExtension[extension] ?? "application/octet-stream";
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
		const filePath = req.getDividedPath().slice(1).join("/");
		const file = {
			mimeType: mimeTypeByExtension[filePath.match(/\.([^./]*)$/)?.[1].toLowerCase()] ?? "application/octet-stream",
			content: body,
		};
		fileByPath.set(filePath, file);
		fsWriteFileSyncRecursive("./build/" + filePath, file.content);
		res.setStatusCode(201).end("OK");
	});
};

const deployMiddlewareGet = async (req, res, data, next) => {
	const filePath = req.getDividedPath().join("/");
	if (req.getDividedPath()[0] === "api") return await next();
	const extension = filePath.match(/\.([^./]*)$/)?.[1]?.toLowerCase();
	if (req.method !== "GET") return res.setStatusCode(405).end();
	console.log(`${req.method} ${req.getPath()}`);
	const file = fileByPath.get(filePath);
	const indexFile = fileByPath.get("index.html");
	console.log(file, indexFile, extension);
	if (file) return res.setHeader("content-type", file.mimeType).end(file.content);
	if (!indexFile) return res.setStatusCode(404).end();
	if (extension in [undefined, "html", "htm"]) return res.setHeader("content-type", indexFile.mimeType).end(indexFile.content);
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
