import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let grid = data.trimEnd().split('\n').map(val => val.split('').map(c=>c.charCodeAt(0)-97));
	let [start, end] = getStartAndEnd(grid);
	grid[start[0]][start[1]] = 0; // set the starting location to elevation 0 (a)
	grid[end[0]][end[1]] = 25; // set the ending location to elevation 25 (z)

	let distances = new Array(grid.length);
	for (let index = 0; index < distances.length; index ++) distances[index] = new Array(grid[index].length);
	for (let row = 0; row < grid.length; row ++) {
		for (let col = 0; col < grid[row].length; col ++) {
			distances[row][col] = Infinity;
		}
	}
	distances[start[0]][start[1]] = 0;

	let changed = true;
	while (changed > 0) {
		changed  = false;
		for (let row = 0; row < grid.length; row ++) {
			for (let col = 0; col < grid[row].length; col ++) {
				let distance = distances[row][col];
				// skip if we dont have a starting distance
				if (distance === Infinity) continue;
				distance ++;
				// try the different directions
				for (const direction of DIRECTIONS) {
					let nextRow = row + direction[0];
					let nextCol = col + direction[1];
					// let next = [row + direction[0], col + direction[1]];
					// if we are off the map
					if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[nextRow].length) continue;
					// if we cant go to the next elevation
					if (grid[nextRow][nextCol] - grid[row][col] > 1) continue;
					// if we have a new shorter distance
					if (distances[nextRow][nextCol] > distance) {
						changed  = true;
						distances[nextRow][nextCol] = distance
					}
				}
			}
		}
	}
	let directionMap = distances.map(row=>row.map(val=>(val === Infinity ? -1 : val)).join(',')).join('\n');

	// console.log(directionMap);
	// console.log(distances[end[0]][end[1]]);
	return distances[end[0]][end[1]];

	let explorations = [[start.join(',')]];
	let shortestPath;

	// let count = 0;
	while (explorations.length > 0) {
		let exploration = explorations.pop();
		let from = exploration[exploration.length - 1].split(',').map(val=>parseInt(val));
		for (const direction of DIRECTIONS) {
			let next = [from[0] + direction[0], from[1] + direction[1]];
			// if we have found the end
			if (next[0] === end[0] && next[1] === end[1]) {
				if (!shortestPath || (shortestPath.length > exploration.length)) shortestPath = exploration;
				continue;
			}
			// if we are off the map
			if (next[0] < 0 || next[0] >= grid.length || next[1] < 0 || next[1] >= grid[next[0]].length) continue;
			// if we cant go to the next elevation
			if (Math.abs(grid[start[0]][start[1]] - grid[next[0]][next[1]]) > 1) continue;
			// if we have already visited
			if (exploration.includes(next)) continue;
			// continue with the exploration
			explorations.push([...exploration, next.join(',')]);
		}
		// count ++;
		// if (count > 10) break;
	}
	console.log(explorations);



	// let result = getShortestPath(grid, start, end);

	return shortestPath;//.length;
}

var getStartAndEnd = function(grid) {
	let start;
	let end;
	
	for (let row = 0; row < grid.length; row ++) {
		for (let col = 0; col < grid[row].length; col ++) {
			if (grid[row][col] === -14) start = [row, col];
			else if (grid[row][col] === -28) end = [row, col];
			if (start && end) return [start, end];
		}
	}
	console.log("not found!?");
	return [start, end];
}
const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
var getShortestPath = function(grid, start, end, path = []) {
	let nextPath = Infinity;
	for (const direction of DIRECTIONS) {
		let next = [start[0] + direction[0], start[1] + direction[1]];
		if (next[0] === end[0] && next[1] === end[1]) return steps;
		if (next[0] < 0 || next[0] >= grid.length || next[1] < 0 || next[1] >= grid[next[0]].length) continue;
		if (Math.abs(grid[start[0]][start[1]] - grid[next[0]][next[1]]) > 1) continue;
		let elevation = grid[next[0]][next[1]];
		grid[next[0]][next[1]] = -1;
		nextPath = Math.min(nextPath, getShortestPath(grid, next, end, steps));
		grid[next[0]][next[1]] = elevation;
	}
	return nextPath;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let grid = data.trimEnd().split('\n').map(val => val.split('').map(c=>c.charCodeAt(0)-97));
	let [start, end] = getStartAndEnd(grid);
	grid[start[0]][start[1]] = 0; // set the starting location to elevation 0 (a)
	grid[end[0]][end[1]] = 25; // set the ending location to elevation 25 (z)

	let distances = new Array(grid.length);
	for (let index = 0; index < distances.length; index ++) distances[index] = new Array(grid[index].length);
	for (let row = 0; row < grid.length; row ++) {
		for (let col = 0; col < grid[row].length; col ++) {
			distances[row][col] = grid[row][col] === 0 ? 0 : Infinity;
			// if (grid[row][col] === 0)
		}
	}
	distances[start[0]][start[1]] = 0;

	let changed = true;
	while (changed > 0) {
		changed  = false;
		for (let row = 0; row < grid.length; row ++) {
			for (let col = 0; col < grid[row].length; col ++) {
				let distance = distances[row][col];
				// skip if we dont have a starting distance
				if (distance === Infinity) continue;
				distance ++;
				// try the different directions
				for (const direction of DIRECTIONS) {
					let nextRow = row + direction[0];
					let nextCol = col + direction[1];
					// let next = [row + direction[0], col + direction[1]];
					// if we are off the map
					if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[nextRow].length) continue;
					// if we cant go to the next elevation
					if (grid[nextRow][nextCol] - grid[row][col] > 1) continue;
					// if we have a new shorter distance
					if (distances[nextRow][nextCol] > distance) {
						changed  = true;
						distances[nextRow][nextCol] = distance
					}
				}
			}
		}
	}
	// let directionMap = distances.map(row=>row.map(val=>(val === Infinity ? -1 : val)).join(',')).join('\n');

	// console.log(directionMap);
	// console.log(distances[end[0]][end[1]]);
	return distances[end[0]][end[1]];
}
// console.log("a".charCodeAt(0));

console.log('part 1:', getAnswer('./2022-12.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-12.txt'));

console.log('part 2:', getAnswer2('./2022-12.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-12.txt'));
