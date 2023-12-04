import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(val => {
		let line = val.split(' ');
		if (line[0] === 'addx') line[1] = parseInt(line[1]);
		return line
	});

	let set = new Set([20,60,100,140,180,220]);
	let sum = 0;
	let x = 0;
	let val = 1;
	let wait = 0;
	let lineIndex = 0;
	for (let index = 0; index <= 220; index ++) {
		// console.log(index, x, sum);
		if (set.has(index)) {
			sum += x * (index);
			// console.log(index, x, sum, x * (index));
		}
		if (wait > 0) {
			wait --;
		} else {
			x += val;
			val = 0;
			if (lineIndex >= lines.length) {
				// ignore this
				// console.log('wut', index);
			} else if (lines[lineIndex][0] === 'addx') {
				wait = 1;
				val = lines[lineIndex][1];
				lineIndex ++;
				// continue;
			} else if (lines[lineIndex][0] === 'noop') {
				wait = 0;
				val = 0;
				lineIndex ++;
				// continue;
			}
		}
	}
	console.log(sum);
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map(val => {
		let line = val.split(' ');
		if (line[0] === 'addx') line[1] = parseInt(line[1]);
		return line
	});

	let set = new Set([20,60,100,140,180,220]);
	let sum = 0;
	let x = 0;
	let val = 1;
	let wait = 0;
	let lineIndex = 0;
	let screen = '';
	let pos = 0;
	for (let index = 0; index <= 240; index ++) {
		// console.log(index, x, sum);
		// console.log(x, pos);
		if (x === pos || x === pos - 1 || x === pos + 1) screen += '#';
		else screen += '.';
		if (wait > 0) {
			wait --;
		} else {
			x += val;
			val = 0;
			if (lineIndex >= lines.length) {
				// ignore this
				// console.log('wut', index);
			} else if (lines[lineIndex][0] === 'addx') {
				wait = 1;
				val = lines[lineIndex][1];
				lineIndex ++;
				// continue;
			} else if (lines[lineIndex][0] === 'noop') {
				wait = 0;
				val = 0;
				lineIndex ++;
				// continue;
			}
		}
		if (index % 40 === 0) {
			screen += '\n';
			pos = 0;
			// sum += x * (index);
			// console.log(index, x, sum, x * (index));
		} else {
			pos ++;
		}
	}
	console.log(screen);
}

// getAnswer('./2022-10.sample.txt');
// getAnswer('./2022-10.sample-2.txt');
// getAnswer('./2022-10.txt');

getAnswer2('./2022-10.sample.txt');
getAnswer2('./2022-10.txt');
