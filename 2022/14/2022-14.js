import { readFileSync } from 'fs';

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			let points = line.split(' -> ').map((point) => point.split(',').map((val) => parseInt(val)));
			return points;
		});

	let minX = Infinity;
	let maxX = 0;
	let minY = Infinity;
	let maxY = 0;

	for (const line of lines) {
		for (const point of line) {
			minX = Math.min(minX, point[0]);
			maxX = Math.max(maxX, point[0]);
			minY = Math.min(minY, point[1]);
			maxY = Math.max(maxY, point[1]);
		}
	}

	let grid = [];
	for (let x = 0; x <= maxX; x++) {
		grid.push([]);
		for (let y = 0; y <= maxY; y++) {
			grid[x].push(0);
		}
	}

	for (const line of lines) {
		let prevPoint = line[0];
		for (let index = 1; index < line.length; index++) {
			let curPoint = line[index];
			drawLine(grid, prevPoint, curPoint);
			prevPoint = curPoint;
		}
	}
	// printGrid(grid, minX, maxX, minY, maxY);
	// return;

	const DIRECTIONS = [
		[0, 1],
		[-1, 1],
		[1, 1]
	];

	let count = -1;
	let sand = true;
	let sandStart = [500, -1];
	while (sand) {
		count++;
		let stuck = false;
		let grainPos = sandStart;
		while (!stuck && sand) {
			for (const direction of DIRECTIONS) {
				stuck = true;
				let nextPos = [grainPos[0] + direction[0], grainPos[1] + direction[1]];
				// console.log('checking', nextPos);
				if (nextPos[0] < minX || nextPos[0] > maxX || nextPos[1] > maxY) {
					// console.log('falling');
					stuck = false;
					sand = false;
					break;
				} else if (grid[nextPos[0]][nextPos[1]] === 0) {
					grainPos = nextPos;
					stuck = false;
					break;
				}
			}
			if (stuck) grid[grainPos[0]][grainPos[1]] = 2;
		}
		// printGrid(grid, minX, maxX, minY, maxY);
		// break;
		// console.log('grain');
	}
	// printGrid(grid, minX, maxX, minY, maxY);
	return count;

	let result = 0;

	for (let index = 0; index < lines.length; index++) {
		let line = lines[index];
	}

	return result;
};

var drawLine = function (grid, from, to) {
	let fromX = Math.min(from[0], to[0]);
	let fromY = Math.min(from[1], to[1]);
	let toX = Math.max(from[0], to[0]);
	let toY = Math.max(from[1], to[1]);

	for (let x = fromX; x <= toX; x++) {
		for (let y = fromY; y <= toY; y++) {
			grid[x][y] = 1;
		}
	}
};
var printGrid = function (grid, minX, maxX, minY, maxY) {
	for (let y = 0; y <= maxY + 10; y++) {
		let line = '';
		for (let x = minX; x <= maxX; x++) {
			if (x >= grid.length || y >= grid[x].length) break;
			if (grid[x][y] === 0) line += '.';
			else if (grid[x][y] === 1) line += '#';
			else if (grid[x][y] === 2) line += 'o';
		}
		console.log(line);
		if (y > maxY) break;
	}
};

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			let points = line.split(' -> ').map((point) => point.split(',').map((val) => parseInt(val)));
			return points;
		});

	let minX = Infinity;
	let maxX = 0;
	let minY = Infinity;
	let maxY = 0;

	for (const line of lines) {
		for (const point of line) {
			minX = Math.min(minX, point[0]);
			maxX = Math.max(maxX, point[0]);
			minY = Math.min(minY, point[1]);
			maxY = Math.max(maxY, point[1]);
		}
	}
	maxY += 2;
	minX = 500 - maxY - 3;
	maxX = 1000 - minX;

	let grid = [];
	for (let x = 0; x <= maxX; x++) {
		grid.push([]);
		for (let y = 0; y <= maxY; y++) {
			grid[x].push(0);
		}
	}

	for (const line of lines) {
		let prevPoint = line[0];
		for (let index = 1; index < line.length; index++) {
			let curPoint = line[index];
			drawLine(grid, prevPoint, curPoint);
			prevPoint = curPoint;
		}
	}
	drawLine(grid, [minX, maxY], [maxX, maxY]);
	// printGrid(grid, minX, maxX, minY, maxY);
	// return;
	// return;

	const DIRECTIONS = [
		[0, 1],
		[-1, 1],
		[1, 1]
	];

	let count = -1;
	let sand = true;
	let sandStart = [500, 0];
	while (sand) {
		count++;
		let stuck = false;
		// if (grid[sandStart[0]][sandStart[1]] !== 0) break;
		let grainPos = sandStart;
		while (!stuck && sand) {
			for (const direction of DIRECTIONS) {
				stuck = true;
				let nextPos = [grainPos[0] + direction[0], grainPos[1] + direction[1]];
				// console.log('checking', nextPos);
				// if (nextPos[0] < minX || nextPos[0] > maxX || nextPos[1] > maxY) {
				// 	// console.log('falling');
				// 	stuck = false;
				// 	sand = false;
				// 	break;
				// } else
				if (grid[nextPos[0]][nextPos[1]] === 0) {
					grainPos = nextPos;
					stuck = false;
					break;
				}
			}
			if (stuck) grid[grainPos[0]][grainPos[1]] = 2;
			if (grainPos === sandStart) sand = false;
		}
		// printGrid(grid, minX, maxX, minY, maxY);
		// break;
		// console.log('grain');
	}
	// printGrid(grid, minX, maxX, 0, maxY);
	return count + 1;
};

console.log('part 1:', getAnswer('./2022-14.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-14.txt'));

console.log('part 2:', getAnswer2('./2022-14.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-14.txt'));
