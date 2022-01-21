const calculatePermutations = (array) => {
	if (array.length == 0) return [];
	if (array.length == 1) return [array];
	return array.flatMap((element, i) => (
		calculatePermutations(array.slice(0, i).concat(array.slice(i + 1))).map((permutation) => [element].concat(permutation))
	));
};

module.exports = calculatePermutations;
