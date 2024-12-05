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

	let map = new Map();
	let curPath = [];
	for (const line of lines) {
		if (line === '$ cd /') {
			curPath = ['/'];
			continue;
		} else if (line === '$ cd ..') {
			curPath.pop();
		} else if (line.startsWith('$ cd ')) {
			curPath.push(line.substring(5) + '/');
		} else if (line === '$ ls') {
			continue;
		} else if (line.startsWith('dir ')) {
			continue;
		} else {
			let file = line.split(' ');
			let fileSize = parseInt(file[0]);

			let path = '';
			for (const part of curPath) {
				path += part;
				let dirSize = map.get(path) || 0;
				dirSize += fileSize;
				map.set(path, dirSize);
			}
		}
	}
	// console.log(map);

	let sum = 0;
	map.forEach((value, key) => {
		if (value <= 100000) sum += value;
	});
	console.log(sum);
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
	let map = new Map();
	let curPath = [];
	for (const line of lines) {
		if (line === '$ cd /') {
			curPath = ['/'];
			continue;
		} else if (line === '$ cd ..') {
			curPath.pop();
		} else if (line.startsWith('$ cd ')) {
			curPath.push(line.substring(5) + '/');
		} else if (line === '$ ls') {
			continue;
		} else if (line.startsWith('dir ')) {
			continue;
		} else {
			let file = line.split(' ');
			let fileSize = parseInt(file[0]);

			let path = '';
			for (const part of curPath) {
				path += part;
				let dirSize = map.get(path) || 0;
				dirSize += fileSize;
				map.set(path, dirSize);
			}
		}
	}
	// console.log(map);

	let totalSpace = 70000000;
	let desiredSpace = 30000000;
	let totalSize = map.get('/') || 0;
	let requiredDelete = desiredSpace - (totalSpace - totalSize);
	let minFolderSize = Infinity;
	map.forEach((value, key) => {
		if (value > requiredDelete) minFolderSize = Math.min(minFolderSize, value);
	});
	console.log(minFolderSize);
};

getAnswer('./2022-07.sample.txt');
getAnswer('./2022-07.txt');

getAnswer2('./2022-07.sample.txt');
getAnswer2('./2022-07.txt');
