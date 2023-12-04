import { readFileSync } from 'fs';

var getMaxCalorieGroup = function (filename) {
	let data;
	try {
		data  = readFileSync(filename, 'utf-8');
		// console.log(data);
	} catch (error) {
		console.error(error);
		return;
	}

	let array = data.split('\n').map(val => parseInt(val));

	let groupSums = [0];
	for (const value of array) {
		if (value) groupSums[groupSums.length - 1] += value;
		else groupSums.push(0);
	}
	groupSums = groupSums.sort((a,b)=>b-a);

	console.log(groupSums[0] + groupSums[1] + groupSums[2]);
}

getMaxCalorieGroup('./2022-01-calorie-counting2.txt');
