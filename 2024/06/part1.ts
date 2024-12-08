import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	let result = 0;
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	let position = { row: 0, col: 0 };
	grid: for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === '^') {
				position = { row, col };
				break grid;
			}
		}
	}

	let direction = 0;
	let next = { row: position.row, col: position.col };
	do {
		if (grid[position.row][position.col] !== 'X') {
			grid[position.row][position.col] = 'X';
			result++;
		}
		next = {
			row: position.row + DIRECTIONS[direction].y,
			col: position.col + DIRECTIONS[direction].x
		};
		if (grid[next.row] && grid[next.row][next.col] === '#') {
			direction = (direction + 1) % 4;
			continue;
		}
		position = next;
	} while (
		position.row >= 0 &&
		position.row < grid.length &&
		position.col >= 0 &&
		position.col < grid[position.row].length
	);

	return result;
}
