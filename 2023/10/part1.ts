export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const start = getStart(grid)!;
	const location = firstAdjacentPipe(grid, start)!;
	let count = 1;
	while (grid[location.row][location.col] != 'S') {
		location.row += DIRECTIONS[location.direction].y;
		location.col += DIRECTIONS[location.direction].x;
		location.direction =
			DIRECTIONS[location.direction].options.find(
				(option) => option.pipe == grid[location.row][location.col]
			)?.direction ?? -1;
		count++;
	}
	return count / 2;
}

export function getStart(grid: string[][]) {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] == 'S') {
				return { row, col };
			}
		}
	}
}

export function firstAdjacentPipe(grid: string[][], start: { row: number; col: number }) {
	for (const direction of DIRECTIONS) {
		const location = { row: start.row + direction.y, col: start.col + direction.x, direction: -1 };
		location.direction =
			direction.options.find((option) => option.pipe == grid[location.row][location.col])
				?.direction ?? -1;
		if (location.direction >= 0) return location;
	}
}

export const DIRECTIONS = [
	// 0: left
	{
		x: -1,
		y: 0,
		options: [
			{ pipe: '-', direction: 0 },
			{ pipe: 'L', direction: 1 },
			{ pipe: 'F', direction: 3 }
		]
	},
	// 1: up
	{
		x: 0,
		y: -1,
		options: [
			{ pipe: '|', direction: 1 },
			{ pipe: '7', direction: 0 },
			{ pipe: 'F', direction: 2 }
		]
	},
	// 2: right
	{
		x: 1,
		y: 0,
		options: [
			{ pipe: '-', direction: 2 },
			{ pipe: 'J', direction: 1 },
			{ pipe: '7', direction: 3 }
		]
	},
	// 3: down
	{
		x: 0,
		y: 1,
		options: [
			{ pipe: '|', direction: 3 },
			{ pipe: 'J', direction: 0 },
			{ pipe: 'L', direction: 2 }
		]
	}
];
