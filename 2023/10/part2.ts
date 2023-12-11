import { DIRECTIONS, firstAdjacentPipe, getStart } from './part1';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const directions: number[][] = []; // vertical direction
	for (const row of grid) {
		directions.push(new Array(row.length).fill(NaN));
	}

	const start = getStart(grid)!;
	const location = firstAdjacentPipe(grid, start)!;
	directions[start.row][start.col] = location.row - start.row;

	while (grid[location.row][location.col] != 'S') {
		if (Number.isNaN(directions[location.row][location.col]))
			directions[location.row][location.col] = 0;
		directions[location.row][location.col] += DIRECTIONS[location.direction].y;
		location.row += DIRECTIONS[location.direction].y;
		location.col += DIRECTIONS[location.direction].x;
		if (Number.isNaN(directions[location.row][location.col]))
			directions[location.row][location.col] = 0;
		directions[location.row][location.col] += DIRECTIONS[location.direction].y;
		location.direction =
			DIRECTIONS[location.direction].options.find(
				(option) => option.pipe == grid[location.row][location.col]
			)?.direction ?? -1;
	}

	let count = 0;
	for (let row = 0; row < grid.length; row++) {
		let direction = 0;
		let toggle = false;
		for (let col = 0; col < grid[row].length; col++) {
			if (Number.isNaN(directions[row][col])) {
				if (toggle) {
					count++;
					grid[row][col] = 'I';
				} else grid[row][col] = 'O';
			} else if (directions[row][col] == 0 || direction == directions[row][col]) {
				continue;
			} else {
				toggle = !toggle;
				direction = directions[row][col];
			}
		}
	}

	return count;
}
