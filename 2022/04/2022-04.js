import { readFileSync } from 'fs';

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			return line.split(',');
		});

	let count = 0;
	for (const line of lines) {
		let first = line[0].split('-').map((val) => parseInt(val));
		let second = line[1].split('-').map((val) => parseInt(val));
		if ((first[0] >= second[0] && first[1] <= second[1]) || (second[0] >= first[0] && second[1] <= first[1])) count++;
	}
	console.log(count);
};

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8').trimEnd();
	} catch (error) {
		console.error(error);
		return;
	}

	let lines = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			return line.split(',');
		});

	let count = 0;
	for (const line of lines) {
		let first = line[0].split('-').map((val) => parseInt(val));
		let second = line[1].split('-').map((val) => parseInt(val));
		if ((first[0] <= second[1] && first[1] >= second[0]) || (second[0] <= first[1] && second[1] >= first[0])) count++;
	}
	console.log(count);
};

getAnswer('./2022-04.sample.txt');
getAnswer('./2022-04.txt');

getAnswer2('./2022-04.sample.txt');
getAnswer2('./2022-04.txt');
