export default function (input: string) {
	let [instructions, _, ...lines] = input.trim().split('\n');
	const map = new Map<string, { left: string; right: string }>();
	lines.forEach((line) => {
		const match = line.match(/^(\w{3}) = \((\w{3}), (\w{3})\)$/i)!;
		map.set(match[1], { left: match[2], right: match[3] });
	});

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
