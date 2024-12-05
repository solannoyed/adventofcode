import { readFileSync } from 'fs';

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let monkeys = data
		.trimEnd()
		.split('\n\n')
		.map((monkeyData) => {
			let monkeyLines = monkeyData.split('\n');
			let monkey = {};
			monkey.items = monkeyLines[1]
				.substring(18)
				.split(', ')
				.map((val) => parseInt(val));
			let operation = monkeyLines[2].substring(23, 24);
			monkey.operation = operation;
			let operationValue = monkeyLines[2].substring(25);
			if (operationValue === 'old') monkey.operation = 'square';
			else monkey.operationValue = parseInt(operationValue);
			monkey.division = parseInt(monkeyLines[3].substring(21));
			monkey.trueMonkey = parseInt(monkeyLines[4].substring(29));
			monkey.falseMonkey = parseInt(monkeyLines[5].substring(30));
			monkey.inspectionCount = 0;
			return monkey;
		});
	// console.log(monkeys);

	for (let round = 0; round < 20; round++) {
		for (const monkey of monkeys) {
			while (monkey.items.length > 0) {
				let item = monkey.items.shift();
				if (monkey.operation === 'square') item *= item;
				else if (monkey.operation === '*') item *= monkey.operationValue;
				else item += monkey.operationValue;
				item = Math.floor(item / 3);

				if (item % monkey.division === 0) {
					monkeys[monkey.trueMonkey].items.push(item);
				} else {
					monkeys[monkey.falseMonkey].items.push(item);
				}

				monkey.inspectionCount++;
			}
		}
	}

	monkeys = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
	return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
};

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let superMod = 1;
	let monkeys = data
		.trimEnd()
		.split('\n\n')
		.map((monkeyData) => {
			let monkeyLines = monkeyData.split('\n');
			let monkey = {};
			monkey.items = monkeyLines[1]
				.substring(18)
				.split(', ')
				.map((val) => parseInt(val));
			let operation = monkeyLines[2].substring(23, 24);
			monkey.operation = operation;
			let operationValue = monkeyLines[2].substring(25);
			if (operationValue === 'old') monkey.operation = 'square';
			else monkey.operationValue = parseInt(operationValue);
			monkey.division = parseInt(monkeyLines[3].substring(21));
			monkey.trueMonkey = parseInt(monkeyLines[4].substring(29));
			monkey.falseMonkey = parseInt(monkeyLines[5].substring(30));
			monkey.inspectionCount = 0;

			superMod *= monkey.division;
			return monkey;
		});

	for (let round = 0; round < 10000; round++) {
		for (const monkey of monkeys) {
			while (monkey.items.length > 0) {
				let item = monkey.items.shift();
				if (monkey.operation === 'square') item *= item;
				else if (monkey.operation === '*') item *= monkey.operationValue;
				else item += monkey.operationValue;

				item %= superMod;

				if (item % monkey.division == 0) {
					monkeys[monkey.trueMonkey].items.push(item);
				} else {
					monkeys[monkey.falseMonkey].items.push(item);
				}

				monkey.inspectionCount++;
			}
		}
	}

	monkeys = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
	return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
};

console.log('part 1:', getAnswer('./2022-11.sample.txt'), '(sample)');
console.log('part 1:', getAnswer('./2022-11.txt'));

console.log('part 2:', getAnswer2('./2022-11.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-11.txt'));
