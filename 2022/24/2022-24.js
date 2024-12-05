// import { readFileSync } from "fs";
import { readFileSync } from 'https://deno.land/std@0.170.0/node/fs.ts';

const DIRECTIONS = {
	LEFT: { name: 'LEFT', x: -1, y: 0 },
	RIGHT: { name: 'RIGHT', x: 1, y: 0 },
	UP: { name: 'UP', x: 0, y: -1 },
	DOWN: { name: 'DOWN', x: 0, y: 1 },
	WAIT: { name: 'WAIT', x: 0, y: 0 }
};
const BLIZZARD_DIRECTIONS = new Map([
	['>', DIRECTIONS.RIGHT],
	['<', DIRECTIONS.LEFT],
	['v', DIRECTIONS.DOWN],
	['^', DIRECTIONS.UP]
]);
// const CUTOFF = 695;
const DIRECTION_ARRAY = [DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.WAIT, DIRECTIONS.RIGHT, DIRECTIONS.DOWN];

var getAnswer = async function (filename, cutoff = 20) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
		// const file = await Deno.open(filename, { read: true });
		// const buf = new U
		// await copy(file, data);
		// file.close();
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			return line.substring(1, line.length - 1).split('');
			// return line;
		});
	// first and last are just walls
	lines.shift();
	lines.pop();

	// this is the number of minutes it takes for the pattern to repeat
	let loop = getLCM(lines.length, lines[0].length);
	// console.log(loop);
	// console.log(lines);

	// console.log(lines.length, lines[0].length, loop);return;
	// get a list of all the blizzards from the input
	let blizzards = [];
	for (let row = 0; row < lines.length; row++) {
		for (let col = 0; col < lines[row].length; col++) {
			if (BLIZZARD_DIRECTIONS.has(lines[row][col]))
				blizzards.push({ x: col, y: row, direction: BLIZZARD_DIRECTIONS.get(lines[row][col]) });
		}
	}
	let rows = lines.length;
	let cols = lines[0].length;
	let locations = new Array(loop).fill(0).map((min) => new Array(cols).fill(0).map((col) => new Array(rows).fill(0)));
	for (let minute = 0; minute < loop; minute++) {
		for (const blizzard of blizzards) {
			// console.log(minute, blizzard, cols, rows);
			locations[minute][(loop * cols + blizzard.x + blizzard.direction.x * minute) % cols][
				(loop * rows + blizzard.y + minute * blizzard.direction.y) % rows
			] = 1;
		}
	}
	// console.log(locations[0]);
	// console.log(locations[1]);
	// console.log(locations[2]);
	// return;
	// TODO: if we BFS and remember visited, we dont need to check others sitting at the same location that have gotten there from a different path
	const visited = new Set();
	// visisted: 'min,x,y'
	// let start = { x: 0, y: -1, minute: 0 };
	// let start = { x: 5, y: 4, minute: 18 };
	// let start = { x: 0, y: -1, minute: 41 };
	// let start = { x: 119, y: 25, minute: 245 };
	let start = { x: 0, y: -1, minute: 528 };
	// let end = { x: 0, y: 0 };
	let end = { x: cols - 1, y: rows - 1 };
	let queue = [start];
	// visited.add(`${start.minute % loop},${start.x},${start.y}`);
	let minPath;
	let minDuration = Infinity;
	while (queue.length > 0) {
		// console.log('queue.length', queue.length);
		// let location = queue.pop(); // pop is DFS
		let location = queue.shift(); // shift is BFS
		// let exitDistance = cols - 1 - location.x + rows - 1 - location.y; // assuming optimal path, we would be able to get to the exit is this many minutes
		// if (location.minute + exitDistance > cutoff || location.minute + exitDistance >= minDuration) {
		// 	// console.log(location);
		// 	continue
		// }
		// if we have reached the exit
		if (location.x === end.x && location.y === end.y) {
			// if (location.x === cols - 1 && location.y === rows - 1) {
			// we have reached the destination quicker than previous, set this as our result
			minPath = location;
			minDuration = location.minute;
			console.log('found a path taking', minDuration, 'minutes');
			//continue;
			break; // for DFS we continue, but BFS has found a quickest path
		}

		// BFS: if we have already added options from this position, we dont need to do it again
		let position = `${location.minute % loop},${location.x},${location.y}`;
		if (visited.has(position)) continue;
		else visited.add(position);

		for (const direction of DIRECTION_ARRAY) {
			// console.log(
			// 	direction.name,
			// 	location.x + direction.x < 0,
			// 	location.x + direction.x >= cols,
			// 	(location.y >= 0 && location.y + direction.y < 0),
			// 	(location.y === -1 && direction !== DIRECTIONS.WAIT && direction !== DIRECTIONS.DOWN),
			// 	(location.y === rows && direction !== DIRECTIONS.WAIT && direction !== DIRECTIONS.UP),
			// 	location.y + direction.y >= rows);
			// the outside is walled
			if (
				location.x + direction.x < 0 ||
				location.x + direction.x >= cols ||
				(location.y + direction.y < 0 && direction !== DIRECTIONS.WAIT) ||
				(location.y + direction.y >= rows && direction !== DIRECTIONS.WAIT)
			)
				continue;
			// console.log(2);
			// make sure the destination does not have a blizzard
			if (locations[(location.minute + 1) % loop][location.x + direction.x][location.y + direction.y] === 1) continue;
			// console.log(3);
			// make sure we aren't going somewhere we have already been
			// let locationString = `${location.visited.size % loop},${location.x + direction.x},${location.y + direction.y}`;
			// if (location.visited.has(locationString)) continue;
			// console.log(4);
			// append the next location
			let next;
			// if (direction === DIRECTIONS.WAIT) next = location; // DIRECTIONS.WAIT is always the last one in the list so we can reuse the object
			// else {
			next = { ...location }; // I think this is just a shallow copy (will copy visited as an object reference)
			next.x += direction.x;
			next.y += direction.y;
			next.minute++;
			// next.visited = new Set([...location.visited]); // I think this is needed because we want a deep copy
			// }
			// next.visited.add(locationString);

			queue.push(next);
		}
	}
	return minPath;
};

// get the lowest common multiple
var getLCM = function (a, b) {
	if (a === 0 || b === 0) return 0;
	let ma = a;
	let mb = b;
	while (ma !== mb) {
		if (ma < mb) ma += a;
		else mb += b;
	}
	return ma;
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
			return line;
		});

	let result = 0;

	for (let index = 0; index < lines.length; index++) {
		let line = lines[index];
	}

	return result;
};

const startTime = performance.now();

// console.log('part 1:', getAnswer('./2022-24.sample-2.txt'), '(sample)');
// console.log('part 1:', getAnswer('./2022-24.sample.txt', 250), '(sample)');
console.log('part 1:', await getAnswer('./2022-24.txt', 631)); // < 4169, < 695, < 644, < 631, != 244, = 245

// console.log('part 2:', getAnswer2('./2022-24.sample.txt'), '(sample)');
// console.log('part 2:', getAnswer2('./2022-24.txt'));

const endTime = performance.now();
console.log('time', Math.trunc(endTime - startTime));
