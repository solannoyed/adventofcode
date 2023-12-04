import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		return line.split(',').map(val => parseInt(val));
	});
	// console.log(lines);
	let connections = new Array(lines.length).fill(0);

	for (let index1 = 0; index1 < lines.length; index1 ++) {
		for (let index2 = index1 + 1; index2 < lines.length; index2 ++) {
			let diff = 0;
			for (let i = 0; i < 3; i ++) {
				diff += Math.abs(lines[index1][i] - lines[index2][i]);
			}
			if (diff === 1) {
				connections[index1] ++;
				connections[index2] ++;
			}
		}
	}

	let result = 6 * lines.length;

	for (let index = 0; index < connections.length; index ++) {
		result -= connections[index];
	}

	return result;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let surfaceArea = getAnswer(filename);

	let minx = Infinity;
	let miny = Infinity;
	let minz = Infinity;
	let maxx = 0;
	let maxy = 0;
	let maxz = 0;
	let coords = data.trimEnd().split('\n').map((line) => {
		let coord = line.split(',').map(val => parseInt(val));
		minx = Math.min(minx, coord[0]);
		miny = Math.min(miny, coord[1]);
		minz = Math.min(minz, coord[2]);
		maxx = Math.max(maxx, coord[0]);
		maxy = Math.max(maxy, coord[1]);
		maxz = Math.max(maxz, coord[2]);

		return coord;
	});
	// console.log(minx, miny, minz, maxx, maxy, maxz);

	// set up the box
	let box = new Array(maxx);
	for (let x = minx; x <= maxx; x ++) {
		box[x] = new Array(maxy);
		for (let y = miny; y <= maxy; y ++) {
			box[x][y] = new Array(maxz);
			for (let z = minz; z <= maxz; z ++) {
				box[x][y][z] = 0;
			}
		}
	}

	// fill the outsides with 'air' (1)
	for (let x = minx; x <= maxx; x ++) {
		for (let y = miny; y <= maxy; y ++) {
			// front and back
			box[x][y][minz] = 1;
			box[x][y][maxz] = 1;
		}
		for (let z = minz; z <= maxz; z ++) {
			// left and right
			box[x][miny][z] = 1;
			box[x][maxy][z] = 1;
		}
	}
	for (let y = miny; y <= maxy; y ++) {
		for (let z = minz; z <= maxz; z ++) {
			box[minx][y][z] = 1;
			box[maxx][y][z] = 1;
		}
	}

	// fill the lava blocks (2)
	for (const [x, y, z] of coords) {
		box[x][y][z] = 2;
	}

	// fill out the air
	let changed = true;
	while (changed) {
		changed = false;
		for (let x = minx + 1; x <= maxx - 1; x ++) {
			for (let y = miny + 1; y <= maxy - 1; y ++) {
				for (let z = minz + 1; z <= maxz - 1; z ++) {
					if (box[x][y][z] !== 0) continue;
					if (
						box[x][y][z-1] === 1 ||
						box[x][y][z+1] === 1 ||
						box[x][y-1][z] === 1 ||
						box[x][y+1][z] === 1 ||
						box[x-1][y][z] === 1 ||
						box[x+1][y][z] === 1
					) {
						changed = true;
						box[x][y][z] = 1;
					}
				}
			}
		}
	}

	// find the remaining unset blocks (0) and check for connected lava blocks
	let count = 0;
	for (let x = minx; x <= maxx; x ++) {
		for (let y = miny; y <= maxy; y ++) {
			for (let z = minz; z <= maxz; z ++) {
				if (box[x][y][z] !== 0) continue;
				count ++;
				if (box[x][y][z-1] === 2) surfaceArea --;
				if (box[x][y][z+1] === 2) surfaceArea --;
				if (box[x][y-1][z] === 2) surfaceArea --;
				if (box[x][y+1][z] === 2) surfaceArea --;
				if (box[x-1][y][z] === 2) surfaceArea --;
				if (box[x+1][y][z] === 2) surfaceArea --;
			}
		}
	}
	console.log('inner blocks', count);

	return surfaceArea;
}

console.log('part 1:', getAnswer('./2022-18.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-18.txt'));

console.log('part 2:', getAnswer2('./2022-18.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-18.txt'));
