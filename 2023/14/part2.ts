export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) =>
			line.split('').map((char) => {
				switch (char) {
					case '#':
						return 1;
					case 'O':
						return -1;
					default:
						return 0;
				}
			})
		);
	const sequence: number[][] = [];
	let index = -1;
	do {
		tiltCycle(grid);
		sequence.push([getLoad(grid), getHash(grid)]);
		index = sequence.findIndex(
			([first, second]) => first == sequence.at(-1)![0] && second == sequence.at(-1)![1]
		);
	} while (index == sequence.length - 1);
	const initial = index + 1;
	const loop = sequence.length - index - 1;
	return sequence[((1e9 - initial) % loop) + initial - 1][0];
}

// load is not unique, need additional value to help identify the loop in the sequence
function getHash(grid: (-1 | 0 | 1)[][]) {
	let value = 0;
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] < 0) {
				value += (row + 1) * (col + 1);
			}
		}
	}
	return value;
}

function getLoad(grid: (-1 | 0 | 1)[][]) {
	let load = 0;
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] < 0) {
				load += grid.length - row;
			}
		}
	}
	return load;
}

function tiltCycle(grid: (-1 | 0 | 1)[][]) {
	tiltNorth(grid);
	tiltWest(grid);
	tiltSouth(grid);
	tiltEast(grid);
}

function tiltNorth(grid: (-1 | 0 | 1)[][]) {
	for (let col = 0; col < grid[0].length; col++) {
		let pos = 0;
		for (let row = 0; row < grid.length; row++) {
			if (grid[row][col] > 0) {
				pos = row + 1;
			} else if (grid[row][col] < 0) {
				grid[row][col] = 0;
				grid[pos][col] = -1;
				pos++;
			}
		}
	}
}

function tiltEast(grid: (-1 | 0 | 1)[][]) {
	for (let row = 0; row < grid.length; row++) {
		let pos = grid[row].length - 1;
		for (let col = grid[row].length - 1; col >= 0; col--) {
			if (grid[row][col] > 0) {
				pos = col - 1;
			} else if (grid[row][col] < 0) {
				grid[row][col] = 0;
				grid[row][pos] = -1;
				pos--;
			}
		}
	}
}

function tiltSouth(grid: (-1 | 0 | 1)[][]) {
	for (let col = 0; col < grid[0].length; col++) {
		let pos = grid.length - 1;
		for (let row = grid.length - 1; row >= 0; row--) {
			if (grid[row][col] > 0) {
				pos = row - 1;
			} else if (grid[row][col] < 0) {
				grid[row][col] = 0;
				grid[pos][col] = -1;
				pos--;
			}
		}
	}
}

function tiltWest(grid: (-1 | 0 | 1)[][]) {
	for (let row = 0; row < grid.length; row++) {
		let pos = 0;
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] > 0) {
				pos = col + 1;
			} else if (grid[row][col] < 0) {
				grid[row][col] = 0;
				grid[row][pos] = -1;
				pos++;
			}
		}
	}
}
