import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const [inputMap, inputMoves] = input.trim().split('\n\n');
	const grid = inputMap
		.trim()
		.split('\n')
		.map((line) =>
			line
				.replaceAll('#', '##')
				.replaceAll('O', '[]')
				.replaceAll('.', '..')
				.replaceAll('@', '@.')
				.split('')
				.map((char) => {
					switch (char) {
						case '#':
							return -1;
						case '[':
							return 1;
						case ']':
							return 2;
						case '@':
							return 3;
						default:
							return 0;
					}
				})
		);
	const robot = {
		x: 0,
		y: 0
	};
	search: for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === 3) {
				grid[y][x] = 0;
				robot.x = x;
				robot.y = y;
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
				default: // '<' is the only one left
					return 3;
			}
		});
	for (const direction of moves) {
		if (move(grid, robot, direction)) {
			robot.x += DIRECTIONS[direction].x;
			robot.y += DIRECTIONS[direction].y;
		}
	}
	let result = 0;
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === 1) {
				result += 100 * row + col;
			}
		}
	}
	return result;
}

function move(grid: number[][], robot: Position, direction: number) {
	// make a list of everything that needs to move
	const boxHashes = new Set();
	const positions = [robot];
	for (let position = 0; position < positions.length; position++) {
		const destination = {
			x: positions[position].x + DIRECTIONS[direction].x,
			y: positions[position].y + DIRECTIONS[direction].y
		};
		const destinationHash = `${destination.x},${destination.y}`;

		if (boxHashes.has(destinationHash) || grid[destination.y][destination.x] === 0) continue;

		if (grid[destination.y][destination.x] < 0) return false;

		positions.push(destination);
		const adjacent = {
			x: destination.x,
			y: destination.y
		};
		if (grid[destination.y][destination.x] === 1) adjacent.x++;
		else adjacent.x--;
		const adjacentHash = `${adjacent.x},${adjacent.y}`;
		if (boxHashes.has(adjacentHash)) continue;
		boxHashes.add(adjacentHash);
		positions.push(adjacent);
	}

	// move from the end, any dependencies are always later in the list
	for (let position = positions.length - 1; position >= 0; position--) {
		grid[positions[position].y + DIRECTIONS[direction].y][positions[position].x + DIRECTIONS[direction].x] =
			grid[positions[position].y][positions[position].x];
		grid[positions[position].y][positions[position].x] = 0;
	}
	return true;
}

interface Position {
	x: number;
	y: number;
}
