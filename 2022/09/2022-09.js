import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(val => val.split(' '));

	let visited = new Set();
	let directions = {
		'R': [1,0],
		'U': [0,1],
		'D': [0,-1],
		'L': [-1,0],
	};
	let head = [0,0];
	let tail = [0,0];
	for (const line of lines) {
		let count = parseInt(line[1]);
		let direction = directions[line[0]];
		for (let i = 0; i < count; i ++) {
			head[0] += direction[0];
			head[1] += direction[1];
			tail = getTailPosition(head, tail);
			visited.add(tail.join(','));
			// console.log(head, tail);
		}
	}
	// console.log(visited);
	console.log(visited.size);
}

var getTailPosition = function(head, tail) {
	let newTail;
	if (head[0] < tail[0] - 1) {
		if (head[1] < tail[1] - 1) newTail = [head[0] + 1, head[1] + 1];
		else if (head[1] > tail[1] + 1) newTail = [head[0] + 1, head[1] - 1];
		else newTail = [head[0] + 1, head[1]];
	} else if (head[0] > tail[0] + 1) {
		if (head[1] < tail[1] - 1) newTail = [head[0] - 1, head[1] + 1];
		else if (head[1] > tail[1] + 1) newTail = [head[0] - 1, head[1] - 1];
		else newTail = [head[0] - 1, head[1]];
	} else if (head[1] < tail[1] - 1) newTail = [head[0], head[1] + 1];
	else if (head[1] > tail[1] + 1) newTail = [head[0], head[1] - 1];
	else newTail = tail;

	// if ((Math.abs(newTail[0] - tail[0]) > 1) || (Math.abs(newTail[1] - tail[1]) > 1)) console.log("moved too far", head, tail, newTail);
	return newTail;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(val => val.split(' '));

	let visited = new Set();
	let directions = {
		'R': [1,0],
		'U': [0,1],
		'D': [0,-1],
		'L': [-1,0],
	};
	let knots = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
	for (const line of lines) {
		let count = parseInt(line[1]);
		let direction = directions[line[0]];
		for (let i = 0; i < count; i ++) {
			knots[0][0] += direction[0];
			knots[0][1] += direction[1];
			for (let knot = 1; knot < knots.length; knot ++) {
				knots[knot] = getTailPosition(knots[knot - 1], knots[knot]);
			}
			visited.add(knots[knots.length - 1].join(','));
			// console.log(head, tail);
		}
		// break;
	}
	// console.log(visited);
	console.log(visited.size);
	// for (let y = -30; y < 10; y ++) {
	// 	let s = '';
	// 	for (let x = -80; x < 10; x ++) {
	// 		if (visited.has('' + x + ',' + y)) s += '#';
	// 		else s += '.';
	// 	}
	// 	console.log(s);
	// }
}

// getAnswer('./2022-09.sample.txt');
// getAnswer('./2022-09.txt');

getAnswer2('./2022-09.sample-2.txt');
getAnswer2('./2022-09.txt');
