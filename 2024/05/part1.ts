export default function (input: string) {
	const [orderings, updates] = input.trim().split('\n\n');
	const orders: Set<number>[] = [];
	for (let i = 0; i < 100; i++) orders.push(new Set());
	orderings
		.split('\n')
		.map((line) => line.split('|').map((num) => parseInt(num)))
		.forEach(([first, second]) => {
			orders[first].add(second);
		});

	let result = 0;
	updates
		.split('\n')
		.map((line) => line.split(',').map((num) => parseInt(num)))
		.filter((update) => {
			for (let first = 0; first < update.length; first++) {
				for (let second = first + 1; second < update.length; second++) {
					if (!orders[update[first]].has(update[second])) return false;
				}
			}
			return true;
		})
		.forEach((update) => {
			result += update[Math.floor(update.length / 2)];
		});

	return result;
}
