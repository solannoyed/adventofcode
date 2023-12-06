export default function (input: string) {
	const [times, distances] = input
		.trim()
		.split('\n')
		.map((line) =>
			line
				.split(':')[1]
				.trim()
				.split(' ')
				.filter((s) => s.length > 0)
				.map((num) => parseInt(num))
		);
	let result = 1;
	for (let race = 0; race < times.length; race++) {
		result *= getMargin(times[race], distances[race]);
	}
	return result;
}

export function getMargin(time: number, distance: number) {
	let start = 1;
	while (start < time && (time - start) * start <= distance) start++;
	let end = time - 1;
	while (end >= start && (time - end) * end <= distance) end--;
	return 1 + end - start;
}
