import { readFileSync } from 'fs';

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n');

	let stacks = [];
	for (let stackIndex = 0; stackIndex < lines[0].length; stackIndex += 4) stacks.push([]);

	let index = -1;
	// for (index = 0; index < lines.count; index ++) {
	while (index < lines.length) {
		index++;
		if (lines[index][0] === 'm') break;
		if (!lines[index].includes('[')) continue;

		// console.log(lines[index]);
		for (let stackIndex = 0; stackIndex < lines[index].length / 4; stackIndex++) {
			let charIndex = stackIndex * 4 + 1;
			// console.log(lines[index][(stackIndex * 4) + 1]);
			if (lines[index][charIndex] !== ' ') stacks[stackIndex].unshift(lines[index][charIndex]);
		}
	}

	// console.log(stacks);
	while (index < lines.length) {
		let words = lines[index].split(' ');
		let count = parseInt(words[1]);
		let from = parseInt(words[3]) - 1;
		let to = parseInt(words[5]) - 1;

		for (let i = 0; i < count; i++) {
			stacks[to].push(stacks[from].pop());
		}
		// let items = stacks[from].splice(stacks[from].length - count, count);
		// stacks[to].push(...items);
		index++;
		// console.log(stacks);
		// console.log();
		// break;
	}

	let result = '';
	for (let i = 0; i < stacks.length; i++) {
		result += stacks[i].pop();
	}
	console.log(result);
	// console.log(stacks);
};

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n');

	let stacks = [];
	for (let stackIndex = 0; stackIndex < lines[0].length; stackIndex += 4) stacks.push([]);

	let index = -1;
	// for (index = 0; index < lines.count; index ++) {
	while (index < lines.length) {
		index++;
		if (lines[index][0] === 'm') break;
		if (!lines[index].includes('[')) continue;

		// console.log(lines[index]);
		for (let stackIndex = 0; stackIndex < lines[index].length / 4; stackIndex++) {
			let charIndex = stackIndex * 4 + 1;
			// console.log(lines[index][(stackIndex * 4) + 1]);
			if (lines[index][charIndex] !== ' ') stacks[stackIndex].unshift(lines[index][charIndex]);
		}
	}

	// console.log(stacks);
	while (index < lines.length) {
		let words = lines[index].split(' ');
		let count = parseInt(words[1]);
		let from = parseInt(words[3]) - 1;
		let to = parseInt(words[5]) - 1;

		// for (let i = 0; i < count; i ++) {
		// 	stacks[to].push(stacks[from].pop());
		// }
		let items = stacks[from].splice(stacks[from].length - count, count);
		stacks[to].push(...items);
		index++;
		// console.log(stacks);
		// console.log();
		// break;
	}

	let result = '';
	for (let i = 0; i < stacks.length; i++) {
		result += stacks[i].pop();
	}
	console.log(result);
	// console.log(stacks);
};

// getAnswer('./2022-05.sample.txt');
// getAnswer('./2022-05.txt');

// getAnswer2('./2022-05.sample.txt');
getAnswer2('./2022-05.txt');
