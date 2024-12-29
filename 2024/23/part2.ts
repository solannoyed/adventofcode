export default function (input: string) {
	const ids: string[] = [];
	const connections: Set<number>[] = [];

	input
		.trim()
		.split('\n')
		.map((line) => line.split('-'))
		.forEach(([c1, c2]) => {
			if (!ids.includes(c1)) {
				connections.push(new Set([ids.length]));
				ids.push(c1);
			}
			if (!ids.includes(c2)) {
				connections.push(new Set([ids.length]));
				ids.push(c2);
			}
			const id1 = ids.indexOf(c1);
			const id2 = ids.indexOf(c2);
			connections[id1].add(id2);
			connections[id2].add(id1);
		});

	let largest = new Set<number>();
	const checked = new Set<string>();
	const queue: { current: Set<number>; others: Set<number> }[] = [];
	for (let id = 0; id < connections.length; id++) {
		const others = new Set([...connections[id]]);
		others.delete(id);
		queue.push({
			current: new Set([id]),
			others
		});
	}
	largest = queue[0].current;

	while (queue.length > 0) {
		const { current, others } = queue.pop()!;
		for (const other of others) {
			if (current.isSubsetOf(connections[other])) {
				const next = new Set([...current, other]);
				const check = hash(next, ids);
				if (checked.has(check)) continue;
				checked.add(check);

				const remaining = others.intersection(connections[other]);
				remaining.delete(other);

				if (next.size > largest.size) largest = next;
				if (next.size + remaining.size <= largest.size) continue;

				queue.push({ current: next, others: remaining });
			}
		}
	}

	return hash(largest, ids);
}

function hash(set: Set<number>, ids: string[]) {
	return [...set]
		.map((id) => ids[id])
		.sort()
		.join(',');
}
