import { CARDINALS } from 'lib/directions';

const CHEAT_LENGTH = 20;

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) =>
			line.split('').map((char) => {
				switch (char) {
					case '#':
						return -1;
					case 'S':
						return 1;
					case 'E':
						return 2;
					default:
						return Infinity;
				}
			})
		);
	const start = { row: 0, col: 0 };
	const end = { row: 0, col: 0 };
	for (let row = 1; row < grid.length - 1; row++) {
		for (let col = 1; col < grid[row].length - 1; col++) {
			if (grid[row][col] === 1) {
				start.row = row;
				start.col = col;
				grid[row][col] = Infinity;
			} else if (grid[row][col] === 2) {
				end.row = row;
				end.col = col;
				grid[row][col] = 0;
			}
		}
	}

	const queue = [end];
	while (queue.length > 0) {
		const current = queue.shift()!;
		for (const direction of CARDINALS) {
			const destination = {
				row: current.row + direction.y,
				col: current.col + direction.x
			};
			if (grid[destination.row][destination.col] <= 0) continue;
			if (grid[current.row][current.col] + 1 >= grid[destination.row][destination.col]) continue;

			grid[destination.row][destination.col] = grid[current.row][current.col] + 1;
			queue.push(destination);
		}
	}

	let result = 0;
	for (let row = 1; row < grid.length - 1; row++) {
		for (let col = 1; col < grid[row].length - 1; col++) {
			if (grid[row][col] < 0) continue;

			for (let y = -CHEAT_LENGTH; y <= CHEAT_LENGTH; y++) {
				const remaining = CHEAT_LENGTH - Math.abs(y);
				for (let x = -remaining; x <= remaining; x++) {
					const length = Math.abs(y) + Math.abs(x);
					const destination = {
						row: row + y,
						col: col + x
					};
					if (
						destination.row <= 0 ||
						destination.row >= grid.length - 1 ||
						destination.col <= 0 ||
						destination.col >= grid[row].length - 1 ||
						grid[destination.row][destination.col] < 0
					)
						continue;
					const difference = grid[row][col] - length - grid[destination.row][destination.col];
					if (difference < 100) continue;
					result++;
				}
			}
		}
	}
	return result;
}
