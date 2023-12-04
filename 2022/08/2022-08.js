import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(line => {
		return line.split('').map(char => {
			return parseInt(char);
		});
	});

	let count = lines.length + lines[0].length;
	count *= 2;
	count -= 4;
	// console.log(count);
	// console.log(lines.length, lines[0].length);
	for (let row = 1; row < lines.length - 1; row ++) {
		for (let col = 1; col < lines[row].length - 1; col ++) {
			// console.log(row, col, checkVisible(lines, row,  col));
			if (checkVisible(lines, row, col)) count ++;
		}
	}
	console.log(count);
}

var checkVisible = function(grid, row, col) {
	// check up
	let visible = true;
	for (let y = row - 1; y >= 0; y --) {
		// console.log(grid[y][col], grid[row][col]);
		if (grid[y][col] >= grid[row][col]) {
			visible = false;
			// console.log('not up');
			break;
		}
	}
	if (visible) return true;

	// check down
	visible = true;
	for (let y = row + 1; y < grid.length; y ++) {
		// console.log(grid[y][col], grid[row][col]);
		if (grid[y][col] >= grid[row][col]) {
			visible = false;
			// console.log('not down');
			break;
		}
	}
	if (visible) return true;

	// check left
	visible = true;
	for (let x = col - 1; x >= 0; x --) {
		if (grid[row][x] >= grid[row][col]) {
			visible = false;
			// console.log('not left');
			break;
		}
	}
	if (visible) return true;

	// check right
	visible = true;
	for (let x = col + 1; x < grid[row].length; x ++) {
		if (grid[row][x] >= grid[row][col]) {
			visible = false;
			// console.log('not right');
			break;
		}
	}
	return visible;
}
var getScore = function(grid, row, col) {
	let score = 1;
	// check up
	let distance = 0;
	for (let y = row - 1; y >= 0; y --) {
		distance ++;
		if (grid[y][col] >= grid[row][col]) {
			break;
		}
	}
	score *= distance;

	// check down
	distance = 0;
	for (let y = row + 1; y < grid.length; y ++) {
		distance ++;
		if (grid[y][col] >= grid[row][col]) {
			break;
		}
	}
	score *= distance;

	// check left
	distance = 0;
	for (let x = col - 1; x >= 0; x --) {
		distance ++;
		if (grid[row][x] >= grid[row][col]) {
			break;
		}
	}
	score *= distance;

	// check right
	distance = 0;
	for (let x = col + 1; x < grid[row].length; x ++) {
		distance ++;
		if (grid[row][x] >= grid[row][col]) {
			break;
		}
	}
	score *= distance;

	return score;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(line => {
		return line.split('').map(char => {
			return parseInt(char);
		});
	});

	let maxScore = 0;
	for (let row = 1; row < lines.length - 1; row ++) {
		for (let col = 1; col < lines[row].length - 1; col ++) {
			maxScore = Math.max(maxScore, getScore(lines, row, col));
		}
	}
	console.log(maxScore);
}

// getAnswer('./2022-08.sample.txt');
// getAnswer('./2022-08.txt');

getAnswer2('./2022-08.sample.txt');
getAnswer2('./2022-08.txt');
