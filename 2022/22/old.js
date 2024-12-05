import { readFileSync } from 'fs';

// const HEADING_RIGHT = 0;
// const HEADING_DOWN = 1;
// const HEADING_LEFT = 2;
// const HEADING_UP = 3;

// const DIRECTION_RIGHT = { x: 1, y: 0 };
// const DIRECTION_DOWN = { x: 0, y: 1 };
// const DIRECTION_LEFT = { x: -1, y: 0 };
// const DIRECTION_UP = { x: 0, y: -1 };

const HEADING_RIGHT = { x: 1, y: 0 };
const HEADING_DOWN = { x: 0, y: 1 };
const HEADING_LEFT = { x: -1, y: 0 };
const HEADING_UP = { x: 0, y: -1 };

const MAP_NONE = ' ';
const MAP_EMPTY = '.';
const MAP_WALL = '#';

const MAP_RIGHT = '>';
const MAP_DOWN = 'V';
const MAP_LEFT = '<';
const MAP_UP = '^';

const ROTATE_RIGHT = 'R';
const ROTATE_LEFT = 'L';

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
			return line.split('');
		});
	let path = lines.pop();
	lines.pop(); // empty line between map and path
	let maxCols = 0;
	lines.forEach((row) => (maxCols = Math.max(maxCols, row.length)));
	const map = new Array(lines.length);
	// this is a bit hacky/lazy, but it solves the looping problem when going 'down' when the next row is shorter
	for (let row = 0; row < lines.length; row++) {
		map[row] = new Array(maxCols);
		map[row].fill(MAP_NONE);
		for (let col = 0; col < lines[row].length; col++) {
			map[row][col] = lines[row][col];
		}
	}
	// return maxCols;

	let directions = [];
	let direction = { heading: HEADING_RIGHT, distance: '' };
	for (let index = 0; index < path.length; index++) {
		if (path[index] === ROTATE_RIGHT || path[index] === ROTATE_LEFT) {
			direction.distance = parseInt(direction.distance);
			directions.push(direction);
			direction = { heading: getHeading(direction.heading, path[index]), distance: '' };
		} else {
			direction.distance += path[index];
		}
	}
	direction.distance = parseInt(direction.distance);
	directions.push(direction);
	console.log(directions);
	return;

	let position = { x: 0, y: 0 };
	while (map[0][position.x] === MAP_NONE) position.x++;

	for (const direction of directions) {
		// console.log(position);
		position = getDestination(map, position, direction);
	}
	// console.log(position, directions[directions.length - 1]);
	drawMap(map);
	console.log(
		1000,
		'* (',
		position.y,
		'+',
		1,
		') + 4 * (',
		position.x,
		'+',
		1,
		') +',
		getHeadingValue(directions[directions.length - 1].heading),
		'=',
		1000 * (position.y + 1) + 4 * (position.x + 1) + getHeadingValue(directions[directions.length - 1].heading)
	);
	return 1000 * (position.y + 1) + 4 * (position.x + 1) + getHeadingValue(directions[directions.length - 1].heading);
	// while (lines[])

	let result = 0;

	for (let index = 0; index < lines.length; index++) {
		let line = lines[index];
	}

	return result;
};

var getHeadingValue = function (heading) {
	switch (heading) {
		case HEADING_RIGHT:
			return 0;
			break;
		case HEADING_DOWN:
			return 1;
			break;
		case HEADING_LEFT:
			return 2;
			break;
		case HEADING_UP:
			return 3;
			break;
		default:
			console.log('??');
			return -1;
			break;
	}
};

var getDestination = function (map, origin, direction) {
	let destination = origin;

	for (let i = 0; i < direction.distance; i++) {
		let tmp = { ...destination };
		updateMap(map, tmp, direction);
		tmp.x += direction.heading.x;
		tmp.y += direction.heading.y;
		// loop around
		if (tmp.y === map.length) tmp.y = 0;
		else if (tmp.y === -1) tmp.y = map.length - 1;
		if (tmp.x === map.length) tmp.x = 0;
		else if (tmp.x === -1) tmp.x = map[tmp.y].length - 1;
		// skip the empty space
		while (
			tmp.y < map.length &&
			tmp.y >= 0 &&
			tmp.x < map[tmp.y].length &&
			tmp.x >= 0 &&
			map[tmp.y][tmp.x] === MAP_NONE
		) {
			tmp.x += direction.heading.x;
			tmp.y += direction.heading.y;
		}
		// loop around
		if (tmp.y === map.length) tmp.y = 0;
		else if (tmp.y === -1) tmp.y = map.length - 1;
		if (tmp.x === map.length) tmp.x = 0;
		else if (tmp.x === -1) tmp.x = map[tmp.y].length - 1;
		// skip empty space again
		while (
			tmp.y < map.length &&
			tmp.y >= 0 &&
			tmp.x < map[tmp.y].length &&
			tmp.x >= 0 &&
			map[tmp.y][tmp.x] === MAP_NONE
		) {
			tmp.x += direction.heading.x;
			tmp.y += direction.heading.y;
		}
		// if we have hit a wall, break out of the loop (and use the previous destination)
		if (map[tmp.y][tmp.x] === MAP_WALL) break;
		else destination = tmp;
	}

	return destination;
};

var drawMap = function (map) {
	for (let row = 0; row < map.length; row++) console.log(map[row].join(''));
};

var updateMap = function (map, position, direction) {
	if (map[position.y][position.x] === MAP_EMPTY) {
		if (direction.heading === HEADING_RIGHT) map[position.y][position.x] = MAP_RIGHT;
		else if (direction.heading === HEADING_DOWN) map[position.y][position.x] = MAP_DOWN;
		else if (direction.heading === HEADING_LEFT) map[position.y][position.x] = MAP_LEFT;
		else if (direction.heading === HEADING_UP) map[position.y][position.x] = MAP_UP;
	}
};
//10R5L5R10L4R5L5
// could optimise this by changing rotation to +/- 1 and making the heading += (4 + rotation) % 4
// or even +3 or +5 then taking %4
var getHeading = function (heading, rotation) {
	switch (heading) {
		case HEADING_RIGHT:
			if (rotation === ROTATE_RIGHT) return HEADING_DOWN;
			else if (rotation === ROTATE_LEFT) return HEADING_UP;
			break;
		case HEADING_DOWN:
			if (rotation === ROTATE_RIGHT) return HEADING_LEFT;
			else if (rotation === ROTATE_LEFT) return HEADING_RIGHT;
			break;
		case HEADING_LEFT:
			if (rotation === ROTATE_RIGHT) return HEADING_UP;
			else if (rotation === ROTATE_LEFT) return HEADING_DOWN;
			break;
		case HEADING_UP:
			if (rotation === ROTATE_RIGHT) return HEADING_RIGHT;
			else if (rotation === ROTATE_LEFT) return HEADING_LEFT;
			break;
		default:
			break;
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
			return line;
		});

	let result = 0;

	for (let index = 0; index < lines.length; index++) {
		let line = lines[index];
	}

	return result;
};

// looking at the front, we use the x-y for both front and back as if only the z changes
// still looking at the front, we use the same concept but with y and z for left/right and top/bottom
// x,y,z = 0 is the front top left of the cube
const CUBE_SAMPLE = {
	width: 4,
	front: {
		startx: 8,
		starty: 0,
		directionx: 1,
		directiony: 1
	},
	back: {
		startx: 8,
		starty: 11,
		directionx: 1,
		directiony: -1
	},
	left: {
		starty: 4,
		startz: 7,
		directiony: 1,
		directionz: -1,
		inverted: true
	},
	right: {
		starty: 11,
		startz: 16,
		directiony: -1,
		directionz: -1
	},
	bottom: {
		startx: 8,
		startz: 4,
		directionx: 1,
		directionz: -1
	},
	top: {
		startx: 3,
		startz: 4,
		directionx: -1,
		directionz: 1
	}
};
const CUBE_INPUT = {
	width: 50,
	front: {
		startx: 50,
		starty: 0,
		directionx: 1,
		directiony: 1
	},
	back: {
		startx: 50,
		starty: 149,
		directionx: 1,
		directiony: -1
	},
	left: {
		starty: 149,
		startz: 0,
		directiony: -1,
		directionz: 1
	},
	right: {
		starty: 100,
		startz: 0,
		directiony: 1,
		directionz: 1
	},
	bottom: {
		startx: 50,
		startz: 50,
		directionx: 1,
		directionz: 1
	},
	top: {
		startx: 0,
		startz: 150,
		directionx: 1,
		directionz: 1,
		inverted: true // x it taken from values along rows (y-axis of input data), z is taken from columns (x-axis of input data)
	}
};
// console.log('part 1:', getAnswer('./2022-22.sample.txt'), '(sample)');
// console.log('part 1:', getAnswer('./2022-22.txt')); // > 14602 > 97406 > 116386

// console.log('part 2:', getAnswer2('./2022-22.sample.txt'), '(sample)');
// console.log('part 2:', getAnswer2('./2022-22.txt'));

const GRIDS_SAMPLE = [
	{
		// 0
		x: 8,
		y: 0,
		width: 4,
		height: 4,

		left: 0,
		right: 0,
		up: 3,
		down: 2
	},
	{
		// 1
		x: 0,
		y: 4,
		width: 8,
		height: 4,

		left: 2,
		right: 2,
		up: 1,
		down: 1
	},
	{
		// 2
		x: 8,
		y: 4,
		width: 4,
		height: 4,

		left: 1,
		right: 1,
		up: 0,
		down: 3
	},
	{
		// 3
		x: 8,
		y: 8,
		width: 4,
		height: 4,

		left: 4,
		right: 4,
		up: 2,
		down: 0
	},
	{
		// 4
		x: 12,
		y: 8,
		width: 4,
		height: 4,

		left: 3,
		right: 3,
		up: 4,
		down: 4
	}
];
const GRIDS_INPUT = [
	{
		// 0
		x: 50,
		y: 0,
		width: 50,
		height: 50,

		left: 1,
		right: 1,
		up: 4,
		down: 2
	},
	{
		// 1
		x: 100,
		y: 0,
		width: 50,
		height: 50,

		left: 0,
		right: 0,
		up: 1,
		down: 1
	},
	{
		// 2
		x: 50,
		y: 50,
		width: 50,
		height: 50,

		left: 2,
		right: 2,
		up: 0,
		down: 4
	},
	{
		// 3
		x: 0,
		y: 100,
		width: 50,
		height: 50,

		left: 4,
		right: 4,
		up: 5,
		down: 5
	},
	{
		// 4
		x: 50,
		y: 100,
		width: 50,
		height: 50,

		left: 3,
		right: 3,
		up: 2,
		down: 1
	},
	{
		x: 0,
		y: 150,
		width: 50,
		height: 50,

		left: 5,
		right: 5,
		up: 3,
		down: 3
	}
];
