import { readFileSync } from 'fs';

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let map = new Map();
	data
		.trimEnd()
		.split('\n')
		.forEach((line) => {
			let parts = line.split(': ');
			let obj = {};
			// obj.id = parts[0];
			if (parts[1].includes('+')) {
				obj.operation = ' + ';
			} else if (parts[1].includes('*')) {
				obj.operation = ' * ';
			} else if (parts[1].includes('/')) {
				obj.operation = ' / ';
			} else if (parts[1].includes('-')) {
				obj.operation = ' - ';
			} else {
				obj.value = parseInt(parts[1]);
			}
			if (obj.operation) {
				[obj.first, obj.second] = parts[1].split(obj.operation);
				obj.operation = obj.operation.trim();
			}
			map.set(parts[0], obj);
		});
	return getValue(map, 'root');
};

var getValue = function (map, key) {
	if (typeof key === 'number') return key;
	if (!map.has(key)) return key;
	let obj = map.get(key);
	if (obj.value !== undefined) return obj.value;
	else {
		obj.first = getValue(map, obj.first);
		obj.second = getValue(map, obj.second);
		if (typeof obj.first === 'string' || typeof obj.second === 'string') return key;
		switch (obj.operation) {
			case '+':
				obj.value = obj.first + obj.second;
				break;
			case '-':
				obj.value = obj.first - obj.second;
				break;
			case '*':
				obj.value = obj.first * obj.second;
				break;
			case '/':
				obj.value = obj.first / obj.second;
				break;
			default:
				console.log('fuck', operation);
				return key;
				break;
		}
		delete obj.first;
		delete obj.operation;
		delete obj.second;
	}
	return obj.value;
};

// c = b - a
// a = b - c
// b = a + c

// c = a - b
// a = b + c
// b = a - c

// c = b / a
// a = b / c
// b = a * c

// c = a / b
// a = b * c
// b = a / c

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let map = new Map();
	// map.set('root', { id: 'root', value: 0 });
	data
		.trimEnd()
		.split('\n')
		.forEach((line) => {
			let parts = line.split(' ');
			let obj = {};
			obj.id = parts[0].substring(0, 4);
			if (obj.id === 'humn') return;
			// else if (obj.id === 'root') return;//obj.id = 'humn';

			if (parts.length === 2) obj.value = parseInt(parts[1]);
			else {
				obj.first = parts[1];
				obj.operation = parts[2];
				obj.second = parts[3];
				// if (obj.operation === '+') obj.operation = '-';
				// else if (obj.operation === '*') obj.operation = '/';
				// else if (obj.operation === '-') obj.operation = '+';
				// else if (obj.operation === '/') obj.operation = '*';

				// if (obj.id !== 'humn') [obj.id, obj.first] = [obj.first, obj.id];
			}
			map.set(obj.id, obj);
		});
	// console.log(map);
	getValue(map, 'root');

	let adjusted = new Map();
	for (const obj of map.values()) {
		if (typeof obj.first === 'string' && typeof obj.second === 'number') {
			if (obj.id === 'root') {
				adjusted.set(obj.first, { id: obj.first, value: obj.second });
				continue;
			}
			let tmp = { id: obj.first, first: obj.id, second: obj.second };
			if (obj.operation === '+')
				tmp.operation = '-'; // a = b + c | b = a - c
			else if (obj.operation === '*')
				tmp.operation = '/'; // a = b * c | b = a / c
			else if (obj.operation === '-')
				tmp.operation = '+'; // a = b - c | b = a + c
			else if (obj.operation === '/') tmp.operation = '*'; // a = b / c | b = a * c
			adjusted.set(tmp.id, tmp);
		} else if (typeof obj.first === 'number' && typeof obj.second === 'string') {
			if (obj.id === 'root') {
				console.log('need to implement this part because it wasnt in the sample');
				continue;
			}
			let tmp = { id: obj.second, first: obj.first, operation: obj.operation, second: obj.id };
			if (obj.operation === '+')
				tmp.operation = '-'; // a = b + c | c = a - b
			else if (obj.operation === '*')
				tmp.operation = '/'; // a = b * c | c = a / b
			else if (obj.operation === '-') [tmp.first, tmp.second] = [tmp.second, tmp.first]; //tmp.operation = '-'; // a = b - c | c = b - a
			// else if (obj.operation === '/') tmp.operation = '/'; // a = b / c | c = b / a
			[tmp.first, tmp.second] = [tmp.second, tmp.first];
			adjusted.set(tmp.id, tmp);
		}
	}
	// console.log(adjusted);
	return getValue(adjusted, 'humn');

	// console.log(map);
	// getValue(map, 'root');
	console.log(map);
	console.log(adjusted);
	return;

	let changed = true;
	while (changed) {
		changed = false;
		for (const [key, obj] of map) {
			if (key === 'root' || key === 'humn') continue;
			if (obj.value !== undefined) continue;
			let result = getValue2(map, key);
			if (result === undefined) continue;
			obj.value = result;
			changed = true;
		}
	}
	console.log(map);
};

// console.log('part 1:', getAnswer('./2022-21.sample.txt'), '(sample)');
// console.log('part 1:', getAnswer('./2022-21.txt'));

// console.log('part 2:', getAnswer2('./2022-21.sample.txt'), '(sample)');
console.log('part 2:', getAnswer2('./2022-21.txt'));
