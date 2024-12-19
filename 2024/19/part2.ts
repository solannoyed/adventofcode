export default function (input: string) {
	const [towelsInput, patternsInput] = input.trim().split('\n\n');
	const towels = towelsInput.split(', ');
	const patterns = patternsInput.split('\n');

	return patterns
		.map((pattern) => patternArrangements(pattern, towels))
		.reduce((accumulator, value) => accumulator + value);
}

function patternArrangements(pattern: string, towels: string[]) {
	const arrangements = new Array(pattern.length + 1).fill(0);
	arrangements[0] = 1;

	for (let arrangement = 0; arrangement < pattern.length; arrangement++) {
		for (let towel = 0; towel < towels.length; towel++) {
			if (towels[towel] === pattern.substring(arrangement, arrangement + towels[towel].length)) {
				arrangements[arrangement + towels[towel].length] += arrangements[arrangement];
			}
		}
	}
	return arrangements[arrangements.length - 1];
}
