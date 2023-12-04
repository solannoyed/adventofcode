import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		return line.split('');
	});

	let sum = 0;
	for (const line of lines) {
		let val = 0;
		for (const char of line) {
			val *= 5;
			switch (char) {
				case '1':
					val += 1;
					break;
				case '2':
					val += 2;
					break;
				case '-':
					val -= 1;
					break;
				case '=':
					val -= 2;
					break;
				default:
					break;
			}
		}
		sum += val;
	}
	// return sum;

	let snafu = [];
	while (sum > 0) {
		let remainder = ((sum + 2) % 5) - 2;
		if (remainder === -1) snafu.unshift('-');
		else if (remainder === -2) snafu.unshift('=');
		else snafu.unshift(remainder);
		sum -= remainder;
		sum /= 5;
	}
	return snafu.join('');
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let lines = data.trimEnd().split('\n').map((line) => {
		return line;
	});

	let result = 0;

	for (let index = 0; index < lines.length; index ++) {
		let line = lines[index];
	}

	return result;
}

console.log('part 1:', getAnswer('./2022-25.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-25.txt'));

// console.log('part 2:', getAnswer2('./2022-25.sample.txt'), '(sample)');
// console.log('part 2:', getAnswer2('./2022-25.txt'));
