import { readFileSync } from "fs";

const ROCKS = new Uint32Array(5);
ROCKS[0] = 0b00011110;
ROCKS[1] = 0b00001000_00011100_00001000;
ROCKS[2] = 0b00000100_00000100_00011100;
ROCKS[3] = 0b00010000_00010000_00010000_00010000;
ROCKS[4] = 0b00011000_00011000;

// const BUFFER_SIZE = 4 * 256 * 1024; // for a byte-array, x * 1MB
// const SAFETY_SIZE = 1 * 256 * 1024; // the number of rows to leave to be safe, instead of calculating how many are blocked
const BUFFER_SIZE = 10 * 1024 * 1024; // for a byte-array, x * 1MB
const SAFETY_SIZE = 4 * 1024 * 1024; // the number of rows to leave to be safe, instead of calculating how many are blocked
// const BLANK_SIZE = 3 * 1024 * 1024;
const EMPTY_ROW = 0b10000000;
const RIGHT_EDGE = 0b00000001_00000001_00000001_00000001;

var getHeight = function(filename, rockCount = 2022, modulus = 0) {
	let jets;
	try {
		// 0 = left, 1 = right
		jets = readFileSync(filename, 'utf-8').trimEnd().split('').map(c => c === '<' ? 0b0 : 0b1);
		// jets = readFileSync(filename, 'utf-8').trimEnd().split('').map(c => c === '<' ? 0b0 : 0b1);
	} catch (error) {
		console.error(error);
		return 0;
	}

	const grid = new Uint8Array(BUFFER_SIZE);
	grid.fill(EMPTY_ROW); // first bit is the 'wall'

	let height = 0;
	let removed = 0;
	let jet = 0;
	let rock;
	let row;
	let offset;
	let rockNum;
	let count = 0;
	// let print;
	for (rockNum = 0; rockNum < rockCount;  rockNum ++)  {
		// if (rockNum % jets.length === 0 && rockNum % 5 === 0) {
		if (rockNum % modulus === 0) {
			if (count % 1 === 0 && rockNum > 0) {
				console.log(rockNum, height + removed);
				drawGridHorizontal(grid, 20, height - 20);
			}
			count ++;
			// print = true
		};
		// clear some old data to make sure we can keep stacking rocks
		if (height >= BUFFER_SIZE - SAFETY_SIZE) {

			// if (height < SAFETY_SIZE) console.log('oops');
			// console.log('test');
			// console.log('trying to resize1');
			// console.log('resizing after rockNum',  rockNum, 'current height', height);
			grid.copyWithin(0, height - SAFETY_SIZE);
			// grid.fill(EMPTY_ROW, SAFETY_SIZE);
			removed += height - SAFETY_SIZE;
			height = SAFETY_SIZE;
			// console.log('total removed', removed, 'new height', height);
			// console.log('trying to resize2');
		}

		rock = ROCKS[rockNum % ROCKS.length];
		row = height + 4;
		while (row > height + 1 || row > 0 && canFall(grid, rock, row)) {
			row --;
			if (!jets[jet] && !overlaps(grid, rock << 1, row)) rock <<= 1;
			else if (jets[jet] && (rock & RIGHT_EDGE) === 0 && !overlaps(grid, rock >>> 1, row)) rock >>>= 1;
			jet = (jet + 1) % jets.length;
			// jet ++;
		}

		// put the rock in the grid
		for (offset = 0; offset < 4; offset ++) {
			grid[row + offset] |= rock >>> offset * 8;
		}

		// adjust our height
		while (grid[height] > EMPTY_ROW) height ++;
	}

	// console.log(height);
	// drawGrid(grid);
	// grid.copyWithin(0, height - 5, height);
	// drawGrid(grid);
	// grid.fill(EMPTY_ROW, 5);
	// drawGrid(grid);

	return removed + height;
}

var canFall = function(grid, rock, row) {
	// 4 is the number of bytes used to represent a rock (32bit)
	for (let offset = 0; offset < 4; offset ++) {
		if (grid[row - 1 + offset] & rock >>> offset * 8) return false;
	}
	return true;
}

var overlaps = function(grid, rock, row) {
	for (let offset = 0; offset < 4; offset ++) {
		if (grid[row + offset] & rock >>> offset * 8) return true;
	}
	return false;
}

var drawGrid = function(grid, limit = 30, offset = 0) {
	for (let row = Math.min(grid.length - 1, limit + offset); row >= offset && row >= 0; row --) {
		console.log(grid[row].toString(2).replaceAll('0', '.').replaceAll('1', '#'));
	}
	console.log('--------');
}

var drawGridHorizontal = function(grid, limit = 30, offset = 0) {
	let lines = new Array(7).fill('');
	for (let row = Math.min(grid.length - 1, limit + offset);  row >= offset && row >= 0; row --) {
		for (let col = 0; col < 7; col ++) {
			if (grid[row] & RIGHT_EDGE << col) lines[col] += '#';
			else lines[col] += '.';
		}
	}
	for (const line of lines) console.log(line);
	// console.log('--------');
}

// var startTime = performance.now();

// console.log('part 1:', getHeight('./2022-17.sample.txt', 12), '(sample)');

// 7 loops (7 * 40 = 280)
// console.log('part 1:', getHeight('./2022-17.sample.txt', 2022), '(sample)');
// console.log('part 1:', getHeight('./2022-17.sample.txt', 10000), '(sample)');

// let rocklimit = 6_500_000;
// let rockoffset = 4;
// console.log('part 1:', getHeight('./2022-17.txt', rockoffset * rocklimit, (rockoffset - 1) * rocklimit));

// console.log('part 1:', getHeight('./2022-17.txt', 1_000_000_000_000 % mod, mod));
// console.log(Math.trunc(1_000_000_000_000 / mod));
const MAX = 1_000_000_000_000;

let mod = 17104245;
let filename = './2022-17.txt';

// mod = 280;
// filename = './2022-17.sample.txt';

let first = getHeight(filename, mod + (MAX % mod));
let second = getHeight(filename, 2 * mod + (MAX % mod));
let count = Math.trunc(MAX / mod);
// let third = getHeight(filename, 3 * mod);
// console.log(first, second, Math.trunc(MAX / mod));
console.log(first + ((second - first) * (count - 1)));

// console.log('part 1:', getHeight('./2022-17.sample.txt', 100_000_000), '(sample)');
//        10_000_000: 685ms
//       100_000_000: 6756ms
// 1_000_000_000_000
// console.log('part 1:', getHeight('./2022-17.txt', 2022));

// var endTime = performance.now();
// console.log('time taken:', Math.trunc(endTime - startTime), 'ms');

// 17507885 -
// 403640
// = 17104245
// let test = 0b010;
// console.log(test, test << 1, test << -1, test >>> 1, test >>> -1); // 2 4 0 1 0

// let test = new Uint8Array(1);
// console.log(test);
// test[0] = 0b10000000;
// console.log(test[0] & ROCKS[0], test[0] & ROCKS[0] << 3);
// if (test[0] & ROCKS[0]) console.log(1);
// if (test[0] & ROCKS[0] << 3) console.log(2);

// let test2 = new Uint8Array(2);
// test2[1] = 255;
// console.log(test2);
// // test2 <<= 8;
// // console.log(test2);

// const test = new Uint8Array([1,2,3,4,5,6,7,8]);
// console.log(test[7], test[8] && 0b11111111 > 0, test[9]);
// test.copyWithin(0, 3, 20);
// console.log(test);

// console.log();

// if (0b10001000 & 0b00001000_00000000 >>> 1 * 8) console.log('true');
// else console.log('false');

// if (!0b1) console.log('true');
// else console.log('false');

// console.log(0 === 0b01 & 0b10);
