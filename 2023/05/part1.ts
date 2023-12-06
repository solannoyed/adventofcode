export default function (input: string) {
	const [[seeds], ...groups] = input
		.trim()
		.split('\n\n')
		.map((group) => group.split(':')[1].trim())
		.map((lists) => lists.split('\n').map((maps) => maps.split(' ').map((num) => parseInt(num))));

	return Math.min(
		...seeds.map((seed) => {
			for (const group of groups) {
				for (const [destination, source, count] of group) {
					if (seed >= source && seed < source + count) {
						seed += destination - source;
						break;
					}
				}
			}
			return seed;
		})
	);
}
