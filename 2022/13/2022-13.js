import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let pairs = data.trimEnd().split('\n\n').map(pair=>pair.split('\n').map(packet=>JSON.parse(packet)));

	let result = 0;

	for (let index = 0; index < pairs.length; index ++) {
	// for (const pair of pairs) {
		let pair = pairs[index];
		if (comparePackets(pair) > 0) result += index + 1;
	}

	return result;
}

var comparePackets = function([first, second]) {
	let result = 0; // 0 is same, 1 is correct order, -1 is incorrect order

	// check if we are comparing two numbers
	if (typeof first === 'number' && typeof second === 'number') {
		if (first < second) result = 1;
		else if (first > second) result = -1;
		return result;
	}

	// if the first is a number redo with two arrays
	if (typeof first === 'number') {
		result = comparePackets([[first], second]);
		return result;
	} else if (typeof second === 'number') {
		result = comparePackets([first, [second]]);
		return result;
	}

	// we have two arrays, so compare for each of the items
	let index = 0;
	while (index < first.length && index < second.length) {
		let c = comparePackets([first[index], second[index]]);
		if (c !== 0) return c; // they are different, so we already have our answer




		// if (typeof first[index] === 'number') {
		// 	if (typeof second[index] === 'number') {
		// 		if (first[index] > second[index]) return false; // both are number, they are not in order
		// 		else if (first[index] < second[index]) return true; // both are number and they are in order
		// 	} else if (!comparePackets([[first[index]], second[index]])) return false;
		// } else if (typeof second[index] === 'number') {
		// 	if (!comparePackets([first[index], second[index]])) return false;
		// } else {
		// 	// both are arrays
			
		// }
		index ++;
	}

	if (first.length < second.length) result = 1;
	else if (first.length > second.length) result = -1;
	else result = 0;

	return result;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let packets = data
		.trimEnd()
		.split('\n')
		.filter(line=>line.length > 0)
		.map(pair=>pair.split('\n').map(packet=>JSON.parse(packet)));
	let firstDivider = [[[2]]];
	let secondDivider = [[[6]]];
	packets.push(firstDivider);
	packets.push(secondDivider);
	packets = packets.sort((first, second) => comparePackets([first, second])).reverse();

	let firstIndex = 1;
	let secondIndex = 1;
	for (let index = 0; index < packets.length; index ++) {
		if (packets[index] == firstDivider) firstIndex += index;
		else if (packets[index] == secondDivider) secondIndex += index;
	}
	// let result;

	return firstIndex * secondIndex;
}

console.log('part 1:', getAnswer('./2022-13.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-13.txt'));

console.log('part 2:', getAnswer2('./2022-13.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-13.txt'));
