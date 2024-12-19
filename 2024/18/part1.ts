import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const size = input.length === 100 ? 7 : 71;
	const drops = input.length === 100 ? 12 : 1024;

	const bytes = input
		.trim()
		.split('\n')
		.map((line) => line.split(',').map((value) => parseInt(value)));

	const grid: number[][] = [];
	for (let y = 0; y < size; y++) grid.push(new Array(size).fill(Infinity));
	for (let drop = 0; drop < drops; drop++) grid[bytes[drop][1]][bytes[drop][0]] = -1;
	grid[0][0] = 0;

	const queue = [{ row: 0, col: 0 }];
	while (queue.length > 0) {
		const { row, col } = queue.shift()!;
		for (const direction of DIRECTIONS) {
			const destination = {
				row: row + direction.y,
				col: col + direction.x
			};
			if (grid[row][col] + 1 < grid[destination.row]?.[destination.col]) {
				grid[destination.row][destination.col] = grid[row][col] + 1;
				queue.push(destination);
			}
		}
	}
	return grid.at(-1)!.at(-1)!;
}
