/**
 * IMPORTANT: input contained an unreachable tile that needs to be changed for this approach:
 *
 *  ..#..
 *  .#.#.
 *  ..#..
 *
 * to
 *
 *  ..#..
 *  .###.
 *  ..#..
 *
 * Alternatively, use `countReachable` from part 1 from each relevant position and do the reverse of the current approach (sum rather than subtracting from max)
 *
 * @param input file content as string
 * @returns
 */
export default function (input: string) {
	const steps = 26501365;
	const plot = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((tile) => tile as Tile));

	const mid = (plot.length - 1) / 2;

	const rocks = [
		{ total: 0, corners: 0 },
		{ total: 0, corners: 0 }
	];
	for (let row = 0; row < plot.length; row++) {
		for (let col = 0; col < plot[row].length; col++) {
			if (plot[row][col] != '#') continue;
			const index = (row + col) % 2;
			rocks[index].total++;
			if (
				row + col < mid || // top left
				row + plot.length < mid + 1 + col || // top right
				plot.length + col < mid + row + 1 || // bottom left
				2 * plot.length < mid + 2 + row + col // bottom right
			) {
				rocks[index].corners++;
			}
		}
	}

	let result = (steps + 1) ** 2;

	const plots = (steps - mid) / plot.length;
	// convenience pointers
	const evens = rocks[0];
	const odds = rocks[1];

	result -= (plots + 1) ** 2 * (odds.total - odds.corners); // odd centers
	result -= plots * (plots + 1) * odds.corners; // odd corners (one edge is outside)
	result -= plots ** 2 * evens.total; // full evens
	result -= plots * evens.corners; // even corners around edge

	return result;
}

type Tile = 'S' | '.' | '#';
