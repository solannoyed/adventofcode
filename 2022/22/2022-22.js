import { readFileSync } from "fs";

const HEADING = {
	LEFT: { x: -1, y: 0, z: 0, value: 2, map: '<' },
	RIGHT: { x: 1, y: 0, z: 0, value: 0, map: '>' },
	DOWN: { x: 0, y: 1, z: 0, value: 1, map: 'v' },
	UP: { x: 0, y: -1, z: 0, value: 3, map: '^' },
	FRONT: { x: 0, y: 0, z: -1 },
	BACK: { x: 0, y: 0, z: 1 }
}

const MAP_EMPTY = '.';
const MAP_WALL = '#';
const MAP_RIGHT = 'R';
const MAP_LEFT = 'L';
const MAP_LOCATION = 'X';

const WALL = 1;
const STRAIGHT = 0;
const RIGHT = 1;
const LEFT = -1;

var getGridAnswer = function(filename, sample = false) {
	// ---- get the input data
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	const input = data.trimEnd().split('\n').map((line) => {
		return line.split('');
	});
	const path = input.pop();
	input.pop() // empty line between map and path

	// ---- set up the map grids
	const config = sample ? GRIDS_SAMPLE : GRIDS_INPUT;
	const grids = new Array(config.length).fill(0);
	for (let index = 0; index < grids.length; index ++) {
		grids[index] = new Array(config[index].width).fill(0).map(_=>new Array(config[index].height));
		for (let y = 0; y < config[index].height; y ++) {
			for (let x = 0; x < config[index].width; x ++) {
				grids[index][x][y] = input[y + config[index].y][x + config[index].x] === MAP_WALL ? 1 : 0;
			}
		}
	}

	// ---- set up the map directions
	let direction = { heading: HEADING.RIGHT, distance: 0 };
	let directions = [direction];
	for (let index = 0; index < path.length; index ++) {
		let rotation = 0;
		if (path[index] === MAP_RIGHT) rotation = RIGHT;
		else if (path[index] === MAP_LEFT) rotation = LEFT;
		else {
			direction.distance *= 10;
			direction.distance += parseInt(path[index]);
			continue;
		}
		direction = { heading: getHeading(direction.heading, rotation), distance: 0 };
		directions.push(direction);
	}

	// ---- traverse the map
	let location = { grid: 0, x: 0, y: 0, heading: HEADING.RIGHT };
	for (const direction of directions) {
		for (let step = 0; step < direction.distance; step ++) {
			// get our destination
			const destination = { ...location };
			destination.heading = direction.heading;
			destination.x += direction.heading.x;
			destination.y += direction.heading.y;
			if (destination.x === config[destination.grid].width) {
				destination.x = 0;
				destination.grid = config[destination.grid].right;
			} else if (destination.x === -1) {
				destination.grid = config[destination.grid].left;
				destination.x = config[destination.grid].width - 1;
			} else if (destination.y === config[destination.grid].height) {
				destination.y = 0;
				destination.grid = config[destination.grid].down;
			} else if (destination.y === -1) {
				destination.grid = config[destination.grid].up;
				destination.y = config[destination.grid].height - 1;
			}
			// update location if destination is not blocked
			if (grids[destination.grid][destination.x][destination.y] !== WALL) {
				input[config[location.grid].y + location.y][config[location.grid].x + location.x] = destination.heading.map;
				location = destination;
				input[config[location.grid].y + location.y][config[location.grid].x + location.x] = MAP_LOCATION;
			} else {
				// update the heading beacuse we still want to face in that direction even if we cant move
				location.heading = direction.heading;
			}
		}
	}

	// ---- get the result, row/col are 0-based so we need to add 1
	let result = 1000 * (config[location.grid].y + location.y + 1); // 1000 * row
	result += 4 * (config[location.grid].x + location.x + 1); // 4 * col
	result += location.heading.value;
	return result;
}

var drawInput = function(input) {
	for (const line of input) {
		console.log(line.join(''));
	}
}

var drawGrids = function(grids) {
	for (let index = 0; index < grids.length; index ++) {
		console.log(index);
		for (let y = 0; y < grids[index][0].length; y ++) {
			let line = '';
			for (let x = 0; x < grids[index].length; x ++) {
				line += grids[index][x][y] === 1 ? '#' : '.';
			}
			console.log(line);
		}
	}
}

var drawCubeFace = function(faces, location, config) {
	console.log('===', config[location.face].name, '===');
	for (let outy = 0; outy < config[location.face].width; outy ++) {
		let line = '';
		for (let outx = 0; outx < config[location.face].width; outx ++) {
			if (location.face === FACE.FRONT || location.face === FACE.BACK) {
				line += getCubeLocationChar(faces, location, location.face, outx, outy, 0);
			} else if (location.face === FACE.TOP || location.face === FACE.BOTTOM) {
				line += getCubeLocationChar(faces, location, location.face, outx, 0, outy);
			} else { // LEFT / RIGHT
				line += getCubeLocationChar(faces, location, location.face, 0, outy, outx);
			}
		}
		console.log(line);
	}
}

var drawCubeFlat = function(faces, location, config) {
	let output = new Array(200).fill(0).map(line=>new Array(150).fill(' '));
	for (let face = 0; face < faces.length; face ++) {
		for (let x = 0; x < faces[face].length; x ++) {
			for (let y = 0; y < faces[face][x].length; y ++) {
				for (let z = 0; z < faces[face][x][y].length; z ++) {
					let outx = config[face].startx + config[face].directionx * x + (config[face].startz + (config[face].directionz * z)) * Math.abs(config[face].directiony);
					let outy = config[face].starty + config[face].directiony * y + (config[face].startz + (config[face].directionz * z)) * Math.abs(config[face].directionx);
					// need to do inversions
					if (config[face].invertxz) output[outy][outx] = getCubeLocationChar(faces, location, face, z, y, x);
					else if (config[face].invertyz) output[outy][outx] = getCubeLocationChar(faces, location, face, x, z, y);
					else output[outy][outx] = getCubeLocationChar(faces, location, face, x, y, z);
				}
			}
		}
	}
	console.log(output.map(line=>line.join('').trimEnd()).join('\n').trimEnd());
}

var getCubeLocationChar = function(faces, location, face, x, y, z) {
	if (face === location.face && location.x === x && location.y === y && location.z === z) return MAP_LOCATION;
	else if (faces[face][x][y][z] === WALL) return MAP_WALL;
	else return MAP_EMPTY;
}

var getHeadingValue = function(heading) {
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
}

var getCubeHeadingValue = function(heading, face, config) {
	// TODO: because we are only going to do this one time, it will be faster to manually calculate than implementing
	console.log('heading', heading);
	console.log('face', face);
	// and we know what config we will be running
}

// could optimise this by changing rotation to +/- 1 and making the heading += (4 + rotation) % 4
// or even +3 or +5 then taking %4
var getHeading = function(heading, rotation) {
	switch (heading) {
		case HEADING.RIGHT:
			if (rotation === RIGHT) return HEADING.DOWN;
			else if (rotation === LEFT) return HEADING.UP;
			break;
		case HEADING.DOWN:
			if (rotation === RIGHT) return HEADING.LEFT;
			else if (rotation === LEFT) return HEADING.RIGHT;
			break;
		case HEADING.LEFT:
			if (rotation === RIGHT) return HEADING.UP;
			else if (rotation === LEFT) return HEADING.DOWN;
			break;
		case HEADING.UP:
			if (rotation === RIGHT) return HEADING.RIGHT;
			else if (rotation === LEFT) return HEADING.LEFT;
			break;
		default:
			break;
	}
}

var getCubeHeading = function(face, heading, rotation) {
	// remember that heading is based on looking at the front of the cube
	// for readability we should probably swap the heading and face checks
	// TODO: make sure that the && and || will work as we are expecting here, otherwise add parentheses
	if (
		heading === HEADING.RIGHT && face === FACE.FRONT ||
		heading === HEADING.LEFT && face === FACE.BACK ||
		heading === HEADING.BACK && face === FACE.RIGHT ||
		heading === HEADING.FRONT && face === FACE.LEFT
	) {
		if (rotation === RIGHT) return HEADING.DOWN;
		else if (rotation === LEFT) return HEADING.UP;
	} else if (
		heading === HEADING.DOWN && face === FACE.FRONT ||
		heading === HEADING.UP && face === FACE.BACK ||
		heading === HEADING.BACK && face === FACE.BOTTOM ||
		heading === HEADING.FRONT && face === FACE.TOP
	) {
		if (rotation === RIGHT) return HEADING.LEFT;
		else if (rotation === LEFT) return HEADING.RIGHT;
	} else if (
		heading === HEADING.LEFT && face === FACE.FRONT ||
		heading === HEADING.BACK && face === FACE.LEFT ||
		heading === HEADING.RIGHT && face === FACE.BACK ||
		heading === HEADING.FRONT && face === FACE.RIGHT
	) {
		if (rotation === RIGHT) return HEADING.UP;
		else if (rotation === LEFT) return HEADING.DOWN;
	} else if (
		heading === HEADING.UP && face === FACE.FRONT ||
		heading === HEADING.DOWN && face === FACE.BACK ||
		heading === HEADING.BACK && face === FACE.TOP ||
		heading === HEADING.FRONT && face === FACE.BOTTOM
	) {
		if (rotation === RIGHT) return HEADING.RIGHT;
		else if (rotation === LEFT) return HEADING.LEFT;
	} else if (
		heading === HEADING.LEFT && face === FACE.BOTTOM ||
		heading === HEADING.UP && face === FACE.LEFT ||
		heading === HEADING.RIGHT && face === FACE.TOP ||
		heading === HEADING.DOWN && face === FACE.RIGHT
	) {
		if (rotation === RIGHT) return HEADING.FRONT;
		else if (rotation === LEFT) return HEADING.BACK;
	} else if (
		heading === HEADING.RIGHT && face === FACE.BOTTOM ||
		heading === HEADING.DOWN && face === FACE.LEFT ||
		heading === HEADING.LEFT && face === FACE.TOP ||
		heading === HEADING.UP && face === FACE.RIGHT
	) {
		if (rotation === RIGHT) return HEADING.BACK;
		else if (rotation === LEFT) return HEADING.FRONT;
	}
}

var getCubeAnswer = function(filename, sample = false) {
	// ---- get the input data
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	const input = data.trimEnd().split('\n').map((line) => {
		return line.split('');
	});
	const path = input.pop();
	// input.pop() // empty line between map and path

	// ---- set up the map cube faces
	const config = sample ? CUBE_SAMPLE : CUBE_INPUT;
	const faces = new Array(config.length);
	for (let face = 0; face < config.length; face ++) {
		faces[face] = new Array(1 + (config[face].width - 1) * Math.abs(config[face].directionx));

		for (let x = 0; x < faces[face].length; x ++) {
			faces[face][x] = new Array(1 + (config[face].width - 1) * Math.abs(config[face].directiony));

			for (let y = 0; y < faces[face][x].length; y ++) {
				faces[face][x][y] = new Array(1 + (config[face].width - 1) * Math.abs(config[face].directionz));

				for (let z = 0; z < faces[face][x][y].length; z ++) {
					let inputx = config[face].startx + (config[face].directionx * x) + (config[face].startz + (config[face].directionz * z)) * Math.abs(config[face].directiony);
					let inputy = config[face].starty + (config[face].directiony * y) + (config[face].startz + (config[face].directionz * z)) * Math.abs(config[face].directionx);
					// inputy is the line, inputx is the character (x-y inverted)
					faces[face][x][y][z] = input[inputy][inputx] === MAP_WALL ? 1 : 0;
				}
			}
		}
		if (config[face].invertxz) {
			for (let x = 1; x < faces[face].length; x ++) {
				for (let z = 0; z < x; z ++) {
					[faces[face][x][0][z], faces[face][z][0][x]] = [faces[face][z][0][x], faces[face][x][0][z]]
				}
			}
		} else if (config[face].invertyz) {
			for (let y = 1; y < faces[face][0].length; y ++) {
				for (let z = 0; z < y; z ++) {
					[faces[face][0][y][z], faces[face][0][z][y]] = [faces[face][0][z][y], faces[face][0][y][z]];
				}
			}
		}
	}

	// ---- set up the map directions
	let direction = { rotation: RIGHT, distance: 0 };
	let directions = [direction];
	for (let index = 0; index < path.length; index ++) {
		let rotation = STRAIGHT;
		if (path[index] === MAP_RIGHT) rotation = RIGHT;
		else if (path[index] === MAP_LEFT) rotation = LEFT;
		else {
			direction.distance *= 10;
			direction.distance += parseInt(path[index]);
			continue;
		}
		direction = { rotation: rotation, distance: 0 };
		directions.push(direction);
	}

	// ---- traverse the map
	let location = { face: FACE.FRONT, x: 0, y: 0, z: 0, heading: HEADING.UP }; // start heading is UP because we turn RIGHT with the first direction
	for (const direction of directions) {
		location.heading = getCubeHeading(location.face, location.heading, direction.rotation);
		for (let step = 0; step < direction.distance; step ++) {
			// get our destination
			const destination = { ...location };
			destination.x += location.heading.x;
			destination.y += location.heading.y;
			destination.z += location.heading.z;
			
			let overflow = false;
			if (destination.x === faces[location.face].length) {
				// moving to the RIGHT face
				destination.x = 0;
				destination.face = FACE.RIGHT;
				overflow = true;
			} else if (destination.x === -1) {
				// moving to the LEFT face
				destination.x = 0;
				destination.face = FACE.LEFT;
				overflow = true;
			} else if (destination.y === faces[location.face][location.x].length) {
				// moving to the BOTTOM face
				destination.y = 0;
				destination.face = FACE.BOTTOM;
				overflow = true;
			} else if (destination.y === -1) {
				// moving to the TOP face
				destination.y = 0;
				destination.face = FACE.TOP;
				overflow = true;
			} else if (destination.z === faces[location.face][location.x][location.y].length) {
				// moving to the BACK face
				destination.z = 0;
				destination.face = FACE.BACK;
				overflow = true;
			} else if (destination.z === -1) {
				// moving to the FRONT face
				destination.z = 0;
				destination.face = FACE.FRONT;
				overflow = true;
			}
			
			if (overflow) {
				// if we have gone over an edge of a face, we are always moving away from that face
				if (location.face === FACE.LEFT) {
					destination.heading = HEADING.RIGHT;
					destination.x = 0;
				} else if (location.face === FACE.RIGHT) {
					destination.heading = HEADING.LEFT;
					destination.x = faces[destination.face].length - 1;
				} else if (location.face === FACE.TOP) {
					destination.heading = HEADING.DOWN;
					destination.y = 0;
				} else if (location.face === FACE.BOTTOM) {
					destination.heading = HEADING.UP;
					destination.y = faces[destination.face][destination.x].length - 1;
				} else if (location.face === FACE.FRONT) {
					destination.heading = HEADING.BACK;
					destination.z = 0;
				} else if (location.face === FACE.BACK) {
					destination.heading = HEADING.FRONT;
					destination.z = faces[destination.face][destination.x][destination.y].length - 1;
				}
			}

			// update the location if destination is not blocked
			if (faces[destination.face][destination.x][destination.y][destination.z] !== WALL) {
				location = destination;
			}
		}
	}

	// ---- get the result
	drawCubeFlat(faces, location, config);
	drawCubeFace(faces, location, config);
	return location;
	// col: 49 + 1 = 50
	// row: 152 + 1 = 153
	// heading: UP
	// 1000 * 153 + 4 * 50 + 3 = 153203
}

const FACE = {
	FRONT: 0,
	BACK: 1,
	LEFT: 2,
	RIGHT: 3,
	BOTTOM: 4,
	TOP: 5
}
// looking at the front, we use the x-y for both front and back as if only the z changes
// still looking at the front, we use the same concept but with y and z for left/right and top/bottom
// x,y,z = 0 is the front top left of the cube
const CUBE_SAMPLE = [
	{
		name: 'FRONT',
		width: 4,
		startx: 8,
		starty: 0,
		startz: 0,
		directionx: 1,
		directiony: 1,
		directionz: 0
	},
	{
		name: 'BACK',
		width: 4,
		startx: 8,
		starty: 11,
		startz: 0,
		directionx: 1,
		directiony: -1,
		directionz: 0
	},
	{
		name: 'LEFT',
		width: 4,
		startx: 0,
		starty: 4,
		startz: 4,
		directionx: 0,
		directiony: 1,
		directionz: 1,
		invertyz: true
	},
	{
		name: 'RIGHT',
		width: 4,
		startx: 0,
		starty: 11,
		startz: 15,
		directionx: 0,
		directiony: -1,
		directionz: -1
	},
	{
		name: 'BOTTOM',
		width: 4,
		startx: 8,
		starty: 0,
		startz: 4,
		directionx: 1,
		directiony: 0,
		directionz: 1
	},
	{
		name: 'TOP',
		width: 4,
		startx: 3,
		starty: 0,
		startz: 4,
		directionx: -1,
		directiony: 0,
		directionz: 1,
	}
];
const CUBE_INPUT = [
	{
		name: 'FRONT',
		width: 50,
		startx: 50,
		starty: 0,
		startz: 0,
		directionx: 1,
		directiony: 1,
		directionz: 0
	},
	{
		name: 'BACK',
		width: 50,
		startx: 50,
		starty: 149,
		startz: 0,
		directionx: 1,
		directiony: -1,
		directionz: 0
	},
	{
		name: 'LEFT',
		width: 50,
		startx: 0,
		starty: 149,
		startz: 0,
		directionx: 0,
		directiony: -1,
		directionz: 1
	},
	{
		name: 'RIGHT',
		width: 50,
		startx: 0,
		starty: 0,
		startz: 100,
		directionx: 0,
		directiony: 1,
		directionz: 1
	},
	{
		name: 'BOTTOM',
		width: 50,
		startx: 50,
		starty: 0,
		startz: 50,
		directionx: 1,
		directiony: 0,
		directionz: 1
	},
	{
		name: 'TOP',
		width: 50,
		startx: 0,
		starty: 0,
		startz: 150,
		directionx: 1,
		directiony: 0,
		directionz: 1,
		invertxz: true
	}
];


const GRIDS_SAMPLE = [
	{ // 0
		x: 8,
		y: 0,
		width: 4,
		height: 4,

		left: 0,
		right: 0,
		up: 3,
		down: 2
	},
	{ // 1
		x: 0,
		y: 4,
		width: 8,
		height: 4,

		left: 2,
		right: 2,
		up: 1,
		down: 1
	},
	{ // 2
		x: 8,
		y: 4,
		width: 4,
		height: 4,

		left: 1,
		right: 1,
		up: 0,
		down: 3
	},
	{ // 3
		x: 8,
		y: 8,
		width: 4,
		height: 4,

		left: 4,
		right: 4,
		up: 2,
		down: 0
	},
	{ // 4
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
	{ // 0
		x: 50,
		y: 0,
		width: 50,
		height: 50,

		left: 1,
		right: 1,
		up: 4,
		down: 2
	},
	{ // 1
		x: 100,
		y: 0,
		width: 50,
		height: 50,

		left: 0,
		right: 0,
		up: 1,
		down: 1
	},
	{ // 2
		x: 50,
		y: 50,
		width: 50,
		height: 50,

		left: 2,
		right: 2,
		up: 0,
		down: 4
	},
	{ // 3
		x: 0,
		y: 100,
		width: 50,
		height: 50,

		left: 4,
		right: 4,
		up: 5,
		down: 5
	},
	{ // 4
		x: 50,
		y: 100,
		width: 50,
		height: 50,

		left: 3,
		right: 3,
		up: 2,
		down: 0
	},
	{ // 5
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

const startTime = performance.now();
// console.log('part 1:', getGridAnswer('./2022-22.sample.txt', true), '(sample expecting 6032)');
// console.log('part 1:', getGridAnswer('./2022-22.txt')); // > 14602, > 97406, > 116386, != 32296, != 38388, != 38390

// console.log('part 2:', getCubeAnswer('./2022-22.sample.txt', true), '(sample)');
console.log('part 2:', getCubeAnswer('./2022-22.txt')); // > 53368 = 153203


const endTime = performance.now();
console.log('time', Math.trunc(endTime - startTime));
