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

/**
 * Calculates the margin using the quadratic formula
 * ```
 * y = distance - (time - x) * x
 * a = -1, b = time, c = -distance
 * ```
 * @returns count of integer `x` values where `y > 0`
 */
export function getMargin(time: number, distance: number) {
	const root = (time ** 2 - 4 * distance) ** 0.5;
	return Math.ceil((time + root) / 2) - Math.floor((time - root) / 2) - 1;
}
