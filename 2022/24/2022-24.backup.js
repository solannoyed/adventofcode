import { readFileSync } from "fs";

const DIRECTIONS = {
	LEFT: { name: 'LEFT', x: -1, y: 0 },
	RIGHT: { name: 'RIGHT', x: 1, y: 0 },
	UP: { name: 'UP', x: 0, y: -1 },
	DOWN: { name: 'DOWN', x: 0, y: 1 },
	WAIT: { name: 'WAIT', x: 0, y: 0 }
}
const BLIZZARD_DIRECTIONS = new Map([
	['>', DIRECTIONS.RIGHT],
	['<', DIRECTIONS.LEFT],
	['v', DIRECTIONS.DOWN],
	['^', DIRECTIONS.UP]
]);
const CUTOFF = 695;
const DIRECTION_ARRAY = [
	DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.WAIT, DIRECTIONS.RIGHT, DIRECTIONS.DOWN
]

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		return line.substring(1, line.length - 1).split('');
		// return line;
	});
	// first and last are just walls
	lines.shift();
	lines.pop();

	// this is the number of minutes it takes for the pattern to repeat
	let loop = getLCM(lines.length, lines[0].length);
	console.log(loop);
	// console.log(lines);

	// console.log(lines.length, lines[0].length, loop);return;
	// get a list of all the blizzards from the input
	let blizzards = [];
	for (let row = 0; row < lines.length; row ++) {
		for (let col = 0; col < lines[row].length; col ++) {
			if (BLIZZARD_DIRECTIONS.has(lines[row][col])) blizzards.push({ x: col, y: row, direction: BLIZZARD_DIRECTIONS.get(lines[row][col])});
		}
	}
	let rows = lines.length;
	let cols = lines[0].length;
	let locations = new Array(loop).fill(0).map(min => new Array(cols).fill(0).map(col => new Array(rows).fill(0)));
	for (let minute = 0; minute < loop; minute ++) {
		for (const blizzard of blizzards) {
			// console.log(minute, blizzard, cols, rows);
			locations[minute][((loop * cols) + blizzard.x + (blizzard.direction.x * minute)) % cols][((loop * rows) + blizzard.y + (minute * blizzard.direction.y)) % rows] = 1;
		}
	}
	// console.log(locations[0]);
	// console.log(locations[1]);
	// console.log(locations[2]);
	// return;

	// visisted: 'min,x,y'
	let queue = [{ x: 0, y: -1, visited: new Set([`0,0,-1`]) }];
	let minPath;
	let minDuration = Infinity;
	while (queue.length > 0) {
		// console.log('queue.length', queue.length);
		let location = queue.pop();
		// let location = queue.shift();
		let exitDistance = cols - 1 - location.x + rows - 1 - location.y; // assuming optimal path, we would be able to get to the exit is this many minutes
		if (location.visited.size + exitDistance > CUTOFF || location.visited.size + exitDistance >= minDuration) {
			// console.log(location);
			continue
		}
		if (location.x === cols - 1 && location.y === rows - 1) {
			// we have reached the destination quicker than previous, set this as our result
			minPath = location;
			minDuration = location.visited.size;
			console.log('found a path taking', minDuration, 'minutes');
			continue;
		}
		for (const direction of DIRECTION_ARRAY) {
			// console.log(direction.name);
			// the outside is walled
			if (
				location.x + direction.x < 0 ||
				location.x + direction.x >= cols ||
				(location.y >= 0 && location.y + direction.y < 0) ||
				(location.y === -1 && direction !== DIRECTIONS.WAIT && direction !== DIRECTIONS.DOWN) ||
				location.y + direction.y >= rows
			) continue;
			// console.log(2);
			// make sure the destination does not have a blizzard
			if (locations[location.visited.size % loop][location.x + direction.x][location.y + direction.y] === 1) continue;
			// console.log(3);
			// make sure we aren't going somewhere we have already been
			let locationString = `${location.visited.size % loop},${location.x + direction.x},${location.y + direction.y}`;
			if (location.visited.has(locationString)) continue;
			// console.log(4);
			// append the next location
			let next;
			// if (direction === DIRECTIONS.WAIT) next = location; // DIRECTIONS.WAIT is always the last one in the list so we can reuse the object
			// else {
				next = { ...location }; // I think this is just a shallow copy (will copy visited as an object reference)
				next.x += direction.x;
				next.y += direction.y;
				next.visited = new Set([...location.visited]); // I think this is needed because we want a deep copy
			// }
			next.visited.add(locationString);

			queue.push(next);
		}
	}
	return minPath;
}

// get the lowest common multiple
var getLCM = function(a, b) {
	if (a === 0 || b === 0) return 0;
	let ma = a;
	let mb = b;
	while (ma !== mb) {
		if (ma < mb) ma += a;
		else mb += b;
	}
	return ma;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		return line;
	});

	let result = 0;

	for (let index = 0; index < lines.length; index ++) {
		let line = lines[index];
	}

	return result;
}

const startTime = performance.now();

// console.log('part 1:', getAnswer('./2022-24.sample-2.txt'), '(sample)');
// console.log('part 1:', getAnswer('./2022-24.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-24.txt')); // < 4169, < 695

// console.log('part 2:', getAnswer2('./2022-24.sample.txt'), '(sample)');
// console.log('part 2:', getAnswer2('./2022-24.txt'));

const endTime = performance.now();
console.log('time', Math.trunc(endTime - startTime));
