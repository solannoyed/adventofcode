import { readFileSync } from "fs";

const DIRECTIONS = [
	[ // north
		{ x: -1, y: -1 },
		{ x: 0, y: -1 },
		{ x: 1, y: -1 }
	],
	[ // south
		{ x: -1, y: 1 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 }
	],
	[ // west
		{ x: -1, y: -1 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 }
	],
	[ // east
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 }
	]
];

const COMPASS = [
	{ x: 0, y: -1 }, // N
	{ x: 1, y: -1 }, // NE
	{ x: 1, y: 0 }, // E
	{ x: 1, y: 1 }, // SE
	{ x: 0, y: 1 }, // S
	{ x: -1, y: 1 }, // SW
	{ x: -1, y: 0 }, // W
	{ x: -1, y: -1 }, // NW
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
		return line.split('');
	});

	const locations = new Map();
	const elves = [];
	for (let y = 0; y < lines.length; y ++) {
		for (let x = 0; x < lines[y].length; x ++) {
			if (lines[y][x] === '#') {
				const elf = { id: elves.length, x: x, y: y };
				locations.set(`${elf.x},${elf.y}`, elf.id);
				elves.push(elf);
			}
		}
	}
	// console.log(elves);

	// let direction = 0; // we will do +1 and %4 after each round for the start index (or just mod when we reference it)
	let round = 0;
	while (true) { // implement a check for if it has spread out enough. or we could have a boolean for if anything ended up moving
		let proposals = new Map();
		// console.log(DIRECTIONS[round % 4]);
		for (const elf of elves) {
			// if the elf is isolated, they wont want to move
			let isolated = true;
			for (const direction of COMPASS) {
				if (locations.has(`${elf.x + direction.x},${elf.y + direction.y}`)) {
					isolated = false;
					break;
				}
			}
			if (isolated) continue;

			// figure out where each elf wants to go
			let proposal = null;
			for (let index = 0; index < DIRECTIONS.length; index ++) { // N/S/E/W
				let blocked = false;
				for (const direction of DIRECTIONS[(round + index) % 4]) { // eg NW/N/NE
					if (locations.has(`${elf.x + direction.x},${elf.y + direction.y}`)) {
						blocked = true
						break;
					}
				}
				if (!blocked) {
					// if no elf was found in that direction, calculate its proposed destination
					proposal = {
						id: elf.id,
						x: elf.x + DIRECTIONS[(round + index) % 4][1].x,
						y: elf.y + DIRECTIONS[(round + index) % 4][1].y
					};
					break;
				}
			}
			if (proposal !== null) {
				// we are close to another elf in some direction and have a proposed location
				// add it to the proposed locations or clear that location's proposals if another elf has proposed it
				let location = `${proposal.x},${proposal.y}`;
				if (proposals.has(location)) proposals.set(location, null);
				else proposals.set(location, proposal);
			}
		}
		// console.log(proposals);
		// console.log(locations);
		for (const proposal of proposals.values()) {
			if (proposal === null) continue;
			let elf =  elves[proposal.id];
			locations.delete(`${elves[proposal.id].x},${elves[proposal.id].y}`);
			elves[proposal.id] = proposal;
			locations.set(`${proposal.x},${proposal.y}`, proposal);
		}
		// console.log(locations);
		// break;

		// return;
		// console.log(elves);
		// break;


		round ++;
		// console.log('== End of Round', round, '==', proposals.size);
		// drawGrove(locations, ...getMinMax(elves));

		// if (proposals.size === 0 || round === 10) break;
		if (proposals.size === 0) break;
	}

	console.log('==', round, 'Rounds ==');
	let [minx, maxx, miny, maxy] = getMinMax(elves);
	// drawGrove(locations, minx, maxx, miny, maxy);
	console.log('minx', minx, 'maxx', maxx, 'miny', miny, 'maxy', maxy);
	return (Math.abs(maxx - minx) + 1) * (Math.abs(maxy - miny) + 1) - elves.length;
}

var getMinMax = function(elves) {
	let minx = Infinity, miny = Infinity;
	let maxx = 0, maxy = 0;
	for (const elf of elves) {
		minx = Math.min(minx, elf.x);
		miny = Math.min(miny, elf.y);
		maxx = Math.max(maxx, elf.x);
		maxy = Math.max(maxy, elf.y);
	}
	return [minx, maxx, miny, maxy];
}

var drawGrove = function(locations, minx, maxx, miny, maxy) {
	for (let y = miny; y <= maxy; y ++) {
		let line = '';
		for (let x = minx; x <= maxx; x ++) {
			if (locations.has(`${x},${y}`)) line += '#';
			else line += '.';
		}
		console.log(line);
	}
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

console.log('part 1:', getAnswer('./2022-23.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-23.sample-2.txt'), '(sample 2)');
console.log('part 1:', getAnswer('./2022-23.sample-3.txt'), '(sample 3)'); // expected 812
console.log('part 1:', getAnswer('./2022-23.txt')); // < 5929

// console.log('part 2:', getAnswer2('./2022-23.sample.txt'), '(sample)');
// console.log('part 2:', getAnswer2('./2022-23.txt'));

const endTime = performance.now();
console.log('time', Math.trunc(endTime - startTime));
