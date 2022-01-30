const termNameToId = (termName) => (termName.toLowerCase().replace(/[^[\p{L|Nd}]()]+/g, " ").trim().replace(/\s+/g, "_"));

module.exports = termNameToId;
