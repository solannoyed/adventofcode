export default function (input: string) {
	const [instructions, , ...lines] = input.trim().split('\n');
	const map = new Map<string, { left: string; right: string }>();
	lines.forEach((line) => {
		const match = line.match(/^(\w{3}) = \((\w{3}), (\w{3})\)$/i)!;
		map.set(match[1], { left: match[2], right: match[3] });
	});

	if (!map.has('AAA')) return -1; // sample 3 is not compatible with part 1

	const location = { node: 'AAA', instruction: 0 };
	while (location.node != 'ZZZ') {
		const current = map.get(location.node)!;
		if (instructions[location.instruction % instructions.length] == 'L') {
			location.node = current.left;
		} else if (instructions[location.instruction % instructions.length] == 'R') {
			location.node = current.right;
		}
		location.instruction++;
	}

	return location.instruction;
}
