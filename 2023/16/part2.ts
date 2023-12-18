import { energisedCount } from './part1';
import type { Tile } from './part1';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((tile) => tile as Tile));
	let max = 0;
	for (let col = 0; col < grid[0].length; col++) {
		max = Math.max(
			max,
			energisedCount({ x: col, y: 0, direction: 2 }, grid),
			energisedCount({ x: col, y: grid.length - 1, direction: 0 }, grid)
		);
	}
	for (let row = 0; row < grid.length; row++) {
		max = Math.max(
			max,
			energisedCount({ x: 0, y: row, direction: 1 }, grid),
			energisedCount({ x: grid[0].length - 1, y: row, direction: 3 }, grid)
		);
	}
	return max;
}
