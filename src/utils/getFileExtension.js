const getFileExtension = (filepath) => (filepath.match(/\.([^./]*)$/)?.[1]?.toLowerCase());

module.exports = getFileExtension;
