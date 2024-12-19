import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const [inputMap, inputMoves] = input.trim().split('\n\n');
	const grid = inputMap
		.trim()
		.split('\n')
		.map((line) =>
			line.split('').map((char) => {
				switch (char) {
					case '#':
						return -1;
					case 'O':
						return 1;
					case '@':
						return 3;
					default:
						return 0;
				}
			})
		);
	let robot = {
		x: 0,
		y: 0
	};
	search: for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === 3) {
				robot = { x, y };
				grid[y][x] = 0;
				break search;
			}
		}
	}
	const moves = inputMoves
		.trim()
		.split('')
		.filter((char) => char !== '\n')
		.map((char) => {
			switch (char) {
				case '^':
					return 0;
				case '>':
					return 1;
				case 'v':
					return 2;
				default: // '<' is the only one *left*
					return 3;
			}
		});
	for (const move of moves) {
		const destination = makeMove(grid, robot, move);
		if (destination !== false) robot = destination;
	}
	let result = 0;
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] > 0) {
				result += 100 * row + col;
			}
		}
	}
	return result;
}

function makeMove(grid: number[][], position: { x: number; y: number }, direction: number) {
	const destination = {
		x: position.x + DIRECTIONS[direction].x,
		y: position.y + DIRECTIONS[direction].y
	};
	if (grid[destination.y][destination.x] < 0) return false;

	if (grid[destination.y][destination.x] > 0 && makeMove(grid, destination, direction) === false) return false;

	grid[destination.y][destination.x] = grid[position.y][position.x];
	grid[position.y][position.x] = 0;

	return destination;
}
