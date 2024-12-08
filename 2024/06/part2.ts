import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
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
	const start = { row: position.row, col: position.col };
	// Make sure we dont set the start position as an obstruction
	grid[start.row][start.col] = 'X';

	// This is basically the same as the willLoop function but we will get the obstructions to use
	let direction = 0;
	const obstructions: (typeof position)[] = [];
	let next = { row: position.row, col: position.col };
	do {
		if (grid[position.row][position.col] !== 'X') {
			grid[position.row][position.col] = 'X';
			obstructions.push(position);
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

	return obstructions.filter((obstruction) => {
		grid[obstruction.row][obstruction.col] = '#';
		const looped = willLoop(grid, start);
		grid[obstruction.row][obstruction.col] = 'X';
		return looped;
	}).length;
}

function willLoop(grid: string[][], start: { row: number; col: number }) {
	const visited = new Set<string>();
	let direction = 0;
	let position = start;
	let next = { row: position.row, col: position.col };
	do {
		const visit = `${position.row},${position.col},${direction}`;
		if (visited.has(visit)) return true;
		else visited.add(visit);
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
	return false;
}
