export default function (input: string) {
	const ids: string[] = [];
	const connections: Set<number>[] = [];

	const computers: number[] = [];
	input
		.trim()
		.split('\n')
		.map((line) => line.split('-'))
		.forEach(([c1, c2]) => {
			if (!ids.includes(c1)) {
				if (c1.startsWith('t')) computers.push(ids.length);
				connections.push(new Set([ids.length]));
				ids.push(c1);
			}
			if (!ids.includes(c2)) {
				if (c2.startsWith('t')) computers.push(ids.length);
				connections.push(new Set([ids.length]));
				ids.push(c2);
			}
			const id1 = ids.indexOf(c1);
			const id2 = ids.indexOf(c2);
			connections[id1].add(id2);
			connections[id2].add(id1);
		});

	let result = 0;
	const visited = new Set<number>();
	for (const id of computers) {
		if (visited.has(id)) continue;
		visited.add(id);

		const others = [...connections[id]];
		for (let first = 0; first < others.length; first++) {
			const c1 = others[first];
			if (visited.has(c1)) continue;
			for (let second = first + 1; second < others.length; second++) {
				const c2 = others[second];
				if (visited.has(c2)) continue;
				if (connections[c1].has(c2)) {
					result++;
				}
			}
		}
	}
	return result;
}
