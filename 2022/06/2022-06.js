import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let line = data.trimEnd();

	let index;
	for (index = 0; index < line.length - 4; index ++) {
		let set = new Set([...line.substring(index, index + 4)]);
		// console.log(set.size);
		if (set.size === 4) {
			console.log(index + 4);
			return;
		}
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
	let line = data.trimEnd();

	let index;
	for (index = 0; index < line.length - 4; index ++) {
		let set = new Set([...line.substring(index, index + 14)]);
		// console.log(set.size);
		if (set.size === 14) {
			console.log(index + 14);
			return;
		}
	}
}

getAnswer('./2022-06.sample.txt');
getAnswer('./2022-06.txt');

getAnswer2('./2022-06.sample.txt');
getAnswer2('./2022-06.txt');
