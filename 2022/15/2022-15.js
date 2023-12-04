import { readFileSync } from "fs";

var getAnswer = function(filename, row) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		line = line.substring(12);
		line = line.split(': closest beacon is at x=');
		line = line.map(val => val.split(', y=').map(num=>parseInt(num)));
		return line;
	});
	// console.log(lines);

	let set = new Set();

	for (let index = 0; index < lines.length; index ++) {
		let sensor = lines[index][0];
		let beacon = lines[index][1];

		let distance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);

		let xDistance = distance - Math.abs(sensor[1] - row);
		if (xDistance < 0) continue;

		for (let x = sensor[0] - xDistance; x <= sensor[0] + xDistance; x ++) set.add(x);
	}
	// console.log(set);

	return set.size - 1;
}

var getDistance = function(point1, point2) {
	return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

var printGrid = function(grid) {
	for (const row of grid) {
		console.log(row.join(''));
	}
}
var getAnswer2 = function(filename, limit) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		line = line.substring(12);
		line = line.split(': closest beacon is at x=');
		line = line.map(val => val.split(', y=').map(num=>parseInt(num)));
		return line;
	}).map(val => {
		let sensor = val[0];
		let beacon = val[1];
		let distance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
		return [sensor, beacon, distance];
	});

	for (let row = 0; row <= limit; row ++) {
		if (row % 100000 === 0) console.log('checking row', row);
		for (let col = 0; col <= limit; col ++) {
			let close = false;
			for (const line of lines) {
				let sensor = line[0];
				let distance = line[2];

				if (
					col > sensor[0] + distance ||
					col < sensor[0] - distance ||
					row > sensor[1] + distance ||
					row < sensor[1] - distance
				) {
					continue;
				}

				let curDistance = getDistance(sensor, [col, row]);
				if (curDistance <= distance) {
					close = true;
					col += distance - curDistance;
					break;
				}

				// if (getDistance(sensor, [col, row]) <= distance) {
				// 	close = true;
				// 	break;
				// }
			}
			if (!close) {
				console.log(col, row);
				return (col * 4000000) + row;
			}
		}
	}

	// let grid = [];
	// for (let x = 0; x <= limit; x ++) {
	// 	let row = [];
	// 	for (let y = 0; y <= limit; y ++) {
	// 		row.push('.');
	// 	}
	// 	grid.push(row);
	// }
	// printGrid(grid);

	// for (const line of lines) {
	// 	let sensor = line[0];
	// 	let beacon = line[1];
	// 	let distance = line[2];
	// 	try { grid[sensor[1]][sensor[0]] = 'S'; } catch {}
	// 	try { grid[beacon[1]][beacon[1]] = 'B'; } catch {}
	// 	for (let diff = 1; diff <= distance; diff ++) {
	// 		try { grid[sensor[1] + diff][sensor[0]] = '#'; } catch {}
	// 		try { grid[sensor[1] - diff][sensor[0]] = '#'; } catch {}
	// 		try { grid[sensor[1]][sensor[0] + diff] = '#'; } catch {}
	// 		try { grid[sensor[1]][sensor[0] - diff] = '#'; } catch {}
	// 	}
	// }
	// printGrid(grid);return;

	// for (let row = 0; row <= limit; row ++) {
	// 	let line = '';
	// 	for (let col = 0; col <= limit; col ++) {
	// 		line += grid[row][col];
	// 	}
	// 	console.log(line);
	// }
	// return 0;

	// let points = [];
	// // let test = [];
	// for (let row = 0; row <= limit; row ++) {
	// 	if (row % 10 === 0) console.log('checking row', row);
	// 	let set = new Set();
	// 	let min = limit;
	// 	let max = 0;
	// 	for (let index = 0; index < lines.length; index ++) {
	// 		let sensor = lines[index][0];
	// 		let beacon = lines[index][1];

	// 		let distance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);

	// 		let xDistance = distance - Math.abs(sensor[1] - row);
	// 		if (xDistance < 0) continue;

	// 		let left = Math.max(sensor[0] - xDistance, 0);
	// 		let right = Math.min(sensor[0] + xDistance, limit);
	// 		min = Math.min(left, min);
	// 		min = Math.max(min, 0);
	// 		max = Math.max(right, max);
	// 		max = Math.min(max, limit);

	// 		for (let x = left; x <= right; x ++) set.add(x);
	// 		if (set.size === limit + 1) break;
	// 	}
	// 	// test.push([row, min, max, set.size]);
	// 	if (set.size < max - min + 1) {
	// 		for (let x = 0; x <= limit; x ++) if (!set.has(x)) {
	// 			points.push([x, row]);
	// 			console.log(points);
	// 		}
	// 	}
	// }
	// // console.log(set);

	// return points;
}

// console.log('part 1:', getAnswer('./2022-15.sample.txt', 10), '(sample)');
// console.log('part 1:', getAnswer('./2022-15.txt', 2000000));

console.log('part 2:', getAnswer2('./2022-15.sample.txt', 20), '(sample)');
console.log('part 2:', getAnswer2('./2022-15.txt', 4000000));
