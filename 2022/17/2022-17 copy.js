import { readFileSync } from "fs";

const GRID_WIDTH = 7;
const ROCK_HEIGHTS =[1, 3, 3, 4, 2];
const ROCK_WIDTHS = [4, 3, 3, 1, 2];
// because of our coordinate space of the grid, we have mirrored over the TL/BR diagonal
const ROCK_TYPES = [
	[
		[1],
		[1],
		[1],
		[1],
	],
	[ // make them equal lengths so that we can have cleaner code
		[0,1,0],
		[1,1,1],
		[0,1,0],
	],
	[
		[1,0,0],
		[1,0,0],
		[1,1,1],
	],
	[
		[1,1,1,1],
	],
	[
		[1,1],
		[1,1],
	],
];
const GRID_HEIGHT = 1_000_000;
const DIRECTION_LEFT = [-1, 0];
const DIRECTION_RIGHT = [1, 0];
const DIRECTION_DOWN = [0, -1];
const DIRECTIONS = {
	left: {
		x: -1,
		y: 0
	},
	right: {
		x: 1,
		y: 0
	},
	down: {
		x: 0,
		y: -1
	}
}

var getAnswer = function(filename, rockCount = 2022) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	// let jets = data.trimEnd()
	let jets = data.trimEnd().split('').map((char) => {
		if (char === '>') return DIRECTION_RIGHT;
		else if (char === '<') return DIRECTION_LEFT;
		else {
			console.log('invalid direction char', char);
			return 0;
		};
	});

	// construct the grid - could do this dynamically
	let grid = [];
	// let segmentSize = 100_000;
	// let gridHeight = 1_000_000; // this magic number is just how much memory we want to use for the grid. larger = fewer resizes but larger memory footprint
	// let gridHeight = 3500; // this magic number 'should' be greater than our expected output
	// let gridHeight = (4 * 2022); // this is worst case 2022 blocks of 4 height all landing on top of each other
	// let gridHeight = rockCount * 2;
	// let tmp = Array(segmentSize).fill(0);
	for (let x = 0; x < GRID_WIDTH; x ++) {
		grid.push(Array(GRID_HEIGHT));
		// grid[x].length = gridHeight;
		// grid[x].fill(0);
		// for (let y = 0; y < gridHeight; y ++) {
		// 	grid[x].push(0);
		// }
	}
	// let jetDirection = new Map();
	// jetDirection.set('<', DIRECTIONS.left);
	// jetDirection.set('>', DIRECTIONS.right);

	// for (let x = 0; x < rockCount; x ++) jetDirection.get(jets[x % jets.length]); // 274ms

	// let jet = 0;
	// for (let x = 0; x < rockCount; x ++) {
	// 	jetDirection.get(jets[jet]);
	// 	jet ++;
	// 	jet %= jets.length;
	// } // 414ms

	// for (let x = 0; x < rockCount; x ++) {
	// 	jets[x  % jets.length] == '>' ? DIRECTIONS.right : DIRECTIONS.left;
	// } // 360ms

	// let jet = 0;
	// for (let x = 0; x < rockCount; x ++) {
	// 	jets[jet] == '>' ? DIRECTIONS.right : DIRECTIONS.left;
	// 	jet ++;
	// 	jet %= jets.length;
	// } // 418ms

	// for (let x = 0; x < rockCount; x ++) {
	// 	jets[x % jets.length];
	// } // 140ms

	// return 0;

	// return grid[1][1] > 0;
	// return grid[1][1] === undefined; // && == null

	// let test = 1_000_000_000_000;
	// let test2 = 23437109;
	// console.log(test2/test);
	// return 0;
	// let testRock = {
	// 	type: 2,
	// 	x: 2,
	// 	y: 3
	// }
	// putRock(grid, testRock);
	// drawGrid(grid, 22);
	// return;
	// let testArr = Array(10).fill(0);
	// testArr[5] = 1;
	// console.log(testArr);
	// testArr.fill(0);
	// console.log(testArr);
	// return 0;

	// let jet = 0;
	let maxHeight = 0;
	let removed = 0; // the number of removed rows;
	// let blockageCount = 0;
	// for (let rockNum = 0; rockNum < 2022; rockNum ++) {
	for (let rockNum = 0; rockNum < rockCount; rockNum ++) { // rock 26 (+ shape) is not falling through a gap
		// if (rockNum % 10_000_000 === 0) console.log('1 ten-thousandth progress');
		if (maxHeight > GRID_HEIGHT - 10) { // extra space to work with at top
			let blockage = gridBlockages(grid);
			if (blockage > 0) {
				// blockageCount ++;
				// if (blockageCount % 5 === 0) console.log('clearing blockage at height', removed, maxHeight, 'with rock count', rockNum);
				// console.log('blockage at', blockage, rockNum);
				// let tmpFill = Array(blockage % segmentSize).fill(0);
				for (let x = 0; x < GRID_WIDTH; x ++) {
					grid[x].splice(0, blockage);
					// let oldLength = grid[x].length;
					grid[x].length = GRID_HEIGHT;
					// grid[x].fill(0, -blockage);
				}
				removed += blockage;
				maxHeight = 0;
			} else {
				console.error('we have run out of room', rockNum);
				break;
			}
		}
		let rock = {
			type: rockNum % 5,
			x: 2,
			y: maxHeight + 4
		}
		while (canTravel(grid, rock, DIRECTION_DOWN)) {
			// console.log("moving down", rock);
			rock.y --;
			// console.log(rock);
			// return;
			if (canTravel(grid, rock, jets[rockNum % jets.length])) {
				rock.x += jets[rockNum % jets.length][0];
			}
			// jet ++;
			// jet %= jets.length;
		}
		// if (rockNum === 26 && false) {
		// 	// console.log(rock);
		// 	drawGrid(grid, 10, 45);
		// 	console.log(canTravel(grid, rock, DIRECTIONS.down, true));
		// }
		// drawGrid(grid, 20);
		putRock(grid, rock);
		maxHeight = Math.max(maxHeight, rock.y + ROCK_HEIGHTS[rock.type]);
	}
	// drawGrid(grid, 20);
	// gridBlockages(grid);
	return removed + maxHeight;
}

var gridBlockages = function(grid) {
	let scanPrev = [];
	for (let x = 0; x < GRID_WIDTH; x ++) {
		scanPrev.push(0);
	}
	for (let y = grid[0].length - 1; y >= 0; y --) {
		let scan = [];
		let block = true;
		for (let x = 0; x < GRID_WIDTH; x ++) {
			if (grid[x][y] > 0) { // grid blocks
				scan.push(1);
				continue;
			}
			if (scanPrev[x] === 0) { // can come from above
				scan.push(0);
				block = false;
				for (let p = x - 1; p >= 0 && scan[p] < 0; p --) scan[p] = 0;
				continue;
			}
			if (x > 0 && scan[x - 1] < 1) {
				scan.push(scan[x - 1]);
				if (scan[x - 1] === 0) block = false;
				continue;
			}
			scan.push(1);
		}
		scanPrev = scan;
		if (block) return y;
	}
	return -1;
}
var canTravel = function(grid, rock, direction) {//}, debug = false) {
	// if (debug) console.log('checking if can travel', rock, direction);
	// check left/right boundaries
	if (rock.x + direction[0] < 0) return false;
	// if (debug) console.log('not off grid left');
	if (rock.x + direction[0] + ROCK_WIDTHS[rock.type] > grid.length) return false;
	// if (debug) console.log('not off grid right');
	if (rock.y + direction[1] < 0) return false;
	// if (debug) console.log('not off grid y');
	// look for overlapping rocks
	// console.log('-');
	for (let x = 0; x < ROCK_TYPES[rock.type].length; x ++) {
		// console.log(ROCK_TYPES[rock.type][x]);
		for (let y = 0; y < ROCK_TYPES[rock.type][x].length; y ++) {
			// if (debug) console.log(rock.x + x + direction.x,
				// rock.y + y + direction.y,
				// grid[rock.x + x + direction.x][rock.y + y + direction.y],
				// ROCK_TYPES[rock.type][x][y])
				// console.log(rock, x, direction);

			if (grid[rock.x + x + direction[0]][rock.y + y + direction[1]] || ROCK_TYPES[rock.type][x][y] > 1) return false;
		}
	}
	return true;
}

var putRock = function(grid, rock) {
	for (let x = 0; x < ROCK_TYPES[rock.type].length; x ++) {
		for (let y = 0; y < ROCK_TYPES[rock.type][x].length; y ++) {
			if (ROCK_TYPES[rock.type][x][y] > 0) grid[rock.x + x][rock.y + y] = 1;
		}
	}
	// for (x = rock.x; x < rock.x + ROCK_TYPES[rock.type][0].length; x ++) {
	// 	for (y = rock.y; y < rock.y + ROCK_TYPES[rock.type].length; y ++) {
	// 		grid
	// 	}
	// }
}

let drawGrid = function(grid, limit, offset = 0) {
	for (let y = offset + limit; y >= offset; y --) {
		let line = '';
		for (let x = 0; x < GRID_WIDTH; x ++) {
			if (grid[x][y] > 0) line += '#';
			else line += '.';
			// line += grid[x][y];
		}
		console.log(line);
	}
	console.log('-------');
}

var getAnswerOld = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let jets = data.trimEnd().split('').map((char) => {
		if (char === '>') return 1;
		else if (char === '<') return -1;
		else return 0;
		// return line;
	});
	// return jets;
	let jet = 0;
	let maxHeight = 0;
	let rocks = []; // rocks that have come to a stop {x, y, type}

	for (let rockNum = 0; rockNum < 2022; rockNum ++) {
		let rock = {
			type: rockNum % 5,
			x: 2,
			y: maxHeight + 3
		};

		move(rocks, rock, jets[jet]); // modifies the rock in place (?)
		jet ++;
		jet %= jets.length;

		while (fall(rocks, rock)) {
			rock.y --;

			move(rocks, rock, jets[jet]);
			jet ++;
			jet %= jets.length;
		}
		rocks.push(rock);

		maxHeight = Math.max(maxHeight, rock.y + ROCK_HEIGHTS[type]);
	}
	return maxHeight;
}

var fall = function(rocks, rock) {
	if (rock.y === 0) return false; // rock is at the bottom
	for (const landed of rocks) {
		if (landed.y + ROCK_HEIGHTS[landed.type] + 1 < rock.y) continue;
		if (landed.y > rock.y + ROCK_HEIGHTS[rock.type] + 1) continue;
		switch (rock.type) {
			case 0:
				switch (landed.type) {
					case 0:
					case 3:
					case 4:
						if (rock.x < landed.x - ROCK_WIDTHS[rock.type] && landed.x < rock.x + ROCK_WIDTHS[rock.type]) return false;
						if (landed.x < rock.x - ROCK_WIDTHS[landed.type] && rock.x < landed.x + ROCK_WIDTHS[landed.type]) return false;
						break;
					case 1:
						break;
					case 2:
						break;
					default:
						console.log('oops');
						break;
				}
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			default:
				console.log('oopsie');
				break;
		}
		for (let x = 0; x < 4; x ++) {
			for (let y = 0; y < 4; y ++) {
				
			}
		}
	}
	rock.y --;
	return true;
}

var move = function(rocks, type, position, height, direction) {
	if (direction < 0 && position === 0) return curr; // against the left wall
	if (direction > 0 && position + ROCK_WIDTHS[type] > 6) return position; // against the right wall

	for (const rock of rocks) {
		if (rock.height + ROCK_HEIGHTS[rock.type] < height) continue;
		if (rock.height > height + ROCK_HEIGHTS[type]) continue;


	}
	
	return curr + direction;
}

var overlap = function(type1, t) {};

var collisionOld = function(rock, prev, curr, height) { // height is currY - prevY
	// prev and next are x coordinates
	if (height > 0) return false; // if they have not lowered to the
	if (prev < 0 && height === 0) return true; // special case for the first rock colliding with the ground
	switch (rock) {
		case 0:
			return curr > prev + 2 || curr < prev - 4;
			break;
		case 1:
			
			break;
		case 2:
			
			break;
		case 3:
			
			break;
		case 4:
			
			break;
		default:
			console.log('invalid collision', rock, prev, cur);
			return true;
			break;
	}
}

var moveOld = function(rock, curr, direction) {
	if (direction < 0 && curr === 0) return curr;
	if (direction > 0 && curr + ROCK_WIDTHS[rock] > 6) return curr;
	else return curr + direction;
}


// console.log('part 1:', getAnswer('./2022-17.sample.txt', 12), '(sample)');
// console.log('part 1:', getAnswer('./2022-17.sample.txt'), '(sample)');
// console.log('part 1:', getAnswer('./2022-17.txt'));

// console.log('part 2:', getAnswer('./2022-17.sample.txt', 10_000_000), '(sample)');
// console.log('part 2:', getAnswer('./2022-17.sample.txt', 1_000_000_000_000), '(sample)');
//                                                       23437109
//                                                       1000000000000 (number we want to use)
//                                                       9007199254740991 (max safe integer)
//                                                       1514285714288 (max height for sample using desired number)
//                                                       169220804 (number referenced in error)
//                                                       20000000 (working with current implementation without shortening array)
// console.log('part 2:', getAnswer('./2022-17.txt', 1_000_000_000_000));

var startTime = performance.now();
console.log('part 2:', getAnswer('./2022-17.sample.txt', 10_000_000), '(sample)');
var endTime = performance.now();
console.log('time taken for 0.01%:', endTime - startTime, 'ms');
