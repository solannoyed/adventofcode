import { readFileSync } from 'fs';

var getCharValue = function (char) {
	// char codes:   a: 97, z: 122, A: 65, Z: 90
	let charCode = char.charCodeAt(0);
	if (charCode >= 97 && charCode <= 122) return charCode - 96;
	else if (charCode >= 65 && charCode <= 90) return charCode - 38;
	console.log('invalid char', char);
	return -1;
};

var getPrioritySum = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8').trimEnd();
	} catch (error) {
		console.error(error);
		return;
	}
	let rucksacks = data.split('\n').map((line) => [line.substring(0, line.length / 2), line.substring(line.length / 2)]);

	let prioritySum = 0;
	for (const rucksack of rucksacks) {
		let set1 = new Set([...rucksack[0]]);
		let set2 = new Set([...rucksack[1]]);
		for (const char of set2) {
			if (set1.has(char)) prioritySum += getCharValue(char);
		}
	}
	console.log(prioritySum);
};
// getPrioritySum('./2022-03-rucksack-reorganization.sample.txt');
// getPrioritySum('./2022-03-rucksack-reorganization.txt');

var getPrioritySum2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8').trimEnd();
	} catch (error) {
		console.error(error);
		return;
	}
	let rucksacks = data.split('\n').map((line) => new Set([...line]));

	let prioritySum = 0;
	for (let index = 0; index < rucksacks.length - 2; index += 3) {
		let set = rucksacks[index];
		for (const char of set) {
			if (rucksacks[index + 1].has(char) && rucksacks[index + 2].has(char)) prioritySum += getCharValue(char);
		}
	}
	console.log(prioritySum);
};
// getPrioritySum2('./2022-03-rucksack-reorganization.sample.txt');
getPrioritySum2('./2022-03-rucksack-reorganization.txt');
