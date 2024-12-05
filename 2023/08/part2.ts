export default function (input: string) {
	const [instructionLine, , ...lines] = input.trim().split('\n');
	const map: number[][] = [];

	const instructions = instructionLine
		.trim()
		.split('')
		.map((instruction) => (instruction == 'L' ? 0 : 1));

	// extract the names so that we can substitute with numbers so it is easier to work with
	const nodeNames: string[] = [];
	const starts: number[] = [];
	const ends = new Set<number>();
	lines.forEach((line) => {
		const match = line.match(/^(\w{3}) =/i)!;
		if (match[1].endsWith('A')) starts.push(nodeNames.length);
		else if (match[1].endsWith('Z')) ends.add(nodeNames.length);
		nodeNames.push(match[1]);
	});

	// now get the map (graph) as indexes
	lines.forEach((line) => {
		const match = line.match(/^\w{3} = \((\w{3}), (\w{3})\)$/i)!;
		map.push([nodeNames.indexOf(match[1]), nodeNames.indexOf(match[2])]);
	});

	// After debugging the input, each of the starting nodes end up looping without a leading path and have only one exit node
	const lengths: number[] = [];
	for (const node of starts) {
		let current = node;
		let instruction = 0;
		let count = 0;
		while (!ends.has(current)) {
			current = map[current][instructions[instruction]];
			instruction++;
			instruction %= instructions.length;
			count++;
		}
		lengths.push(count);
	}

	// This means that we can just take the lowest common multiple of each length to the exit node, how convenient!
	lengths.sort((first, second) => second - first);
	return lengths.reduce((first, second) => {
		let multiple = first;
		while (multiple % second > 0) multiple += first;
		return multiple;
	});
}
