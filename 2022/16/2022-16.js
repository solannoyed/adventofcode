import { readFileSync } from "fs";

var getAnswer = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let rates = new Map();
	let paths = new Map();
	data.trimEnd().split('\n').forEach((line) => {
		let valve = line.substring(6, 8);
		let rateIndex = line.indexOf('=');
		let delimIndex = line.indexOf(';'); // 24 more
		let rate = parseInt(line.substring(rateIndex + 1, delimIndex));
		let tunnels = line.substring(delimIndex + 24).trimStart().split(', ');

		let path = new Map();
		for (const tunnel of tunnels) {
			path.set(tunnel, 1);
		}
		path.set(valve, 0);

		rates.set(valve, rate);
		paths.set(valve, path);
	});
	// console.log(rates);return;

	let updated = true;
	while (updated) {
		updated = false;
		for (const [origin, path] of paths) {
			for (const [tunnel1, distance1] of path) {
				for (const [tunnel2, distance2] of paths.get(tunnel1)) {
					if (tunnel2 === origin || distance2 === 0) continue;
					let curDistance = paths.get(tunnel2).get(origin) ?? Infinity;
					if (curDistance > distance1 + distance2) {
						paths.get(tunnel2).set(origin, distance1 + distance2);
						updated = true;
					}
				}
			}
		}
	}
	// console.log(paths);return;
	// const keys = ['AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ'];
	// for (const key1 of keys) {
	// 	let line = '';
	// 	for (const key2 of keys) {
	// 		line += ' ' + paths.get(key1).get(key2);
	// 	}
	// 	console.log(line);
	// }return;

	let destinations = new Set();
	rates.forEach((value, key) => {
		if (value > 0) destinations.add(key);
	});
	// console.log(destinations);return;

	let dp = []; // time, visited, pressure
	for (const destination of destinations) {
		let obj = {};
		obj.time = 30 - paths.get('AA').get(destination) - 1;
		obj.destinations = new Set([...destinations]);
		obj.destinations.delete(destination);
		obj.path = [destination];
		obj.pressure = obj.time * rates.get(destination);
		// obj.location = destination;
		dp.push(obj);
	}
	// console.log(dp);return;

	let maxPressure = 0;
	let maxPath;
	while (dp.length > 0) {
		let cur = dp.pop();
		if (maxPressure < cur.pressure) {
			maxPressure = cur.pressure;
			maxPath = cur.path;
		}
		for (const destination of cur.destinations) {
			let time = cur.time;
			let distance = paths.get(cur.path[cur.path.length - 1]).get(destination);
			if (time - distance <= 1) continue;
			let obj = {};
			obj.time = time - distance - 1;
			obj.destinations = new Set([...cur.destinations]);
			obj.destinations.delete(destination);
			obj.path = [...cur.path, destination];
			obj.pressure = cur.pressure + obj.time * rates.get(destination);
			// obj.location = destination;
			dp.push(obj);
		}
		// console.log(dp);
		// break;
	}
	// console.log(maxPath);
	return maxPressure;


	// get the 'distance' (time cost) from/to each valve
	// ignore valves that have 0 rate (we only wanted them to determine distance)
	// calculate the best order with DP to maximize released pressure
	let result = 0;

	// for (let index = 0; index < lines.length; index ++) {
	// 	let line = lines[index];
	// }

	return paths;
}

var getAnswer2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let rates = new Map();
	let paths = new Map();
	data.trimEnd().split('\n').forEach((line) => {
		let valve = line.substring(6, 8);
		let rateIndex = line.indexOf('=');
		let delimIndex = line.indexOf(';'); // 24 more
		let rate = parseInt(line.substring(rateIndex + 1, delimIndex));
		let tunnels = line.substring(delimIndex + 24).trimStart().split(', ');

		let path = new Map();
		for (const tunnel of tunnels) {
			path.set(tunnel, 1);
		}
		path.set(valve, 0);

		rates.set(valve, rate);
		paths.set(valve, path);
	});

	let updated = true;
	while (updated) {
		updated = false;
		for (const [origin, path] of paths) {
			for (const [tunnel1, distance1] of path) {
				for (const [tunnel2, distance2] of paths.get(tunnel1)) {
					if (tunnel2 === origin || distance2 === 0) continue;
					let curDistance = paths.get(tunnel2).get(origin) ?? Infinity;
					if (curDistance > distance1 + distance2) {
						paths.get(tunnel2).set(origin, distance1 + distance2);
						updated = true;
					}
				}
			}
		}
	}
	// let dests = ['XS', 'OP', 'CC'];
	// let origs = ['TD', 'XJ'];
	// for (const orig of origs) {
	// 	for (const dest of dests) {
	// 		console.log(orig, dest, paths.get(orig).get(dest));
	// 	}
	// }
	// return;
	// console.log(paths.get('TD').get('XS'));
	// console.log([...paths.keys()]);return;
	// const keys = [...paths.keys()];
	// for (const key1 of keys) {
	// 	let line = '';
	// 	for (const key2 of keys) {
	// 		line += ' ' + paths.get(key1).get(key2);
	// 	}
	// 	console.log(line);
	// }return;

	let destinations = new Set();
	rates.forEach((value, key) => {
		if (value > 0) destinations.add(key);
	});
	destinations = [...destinations];

	let dp = [];
	for (let index1 = 0; index1 < destinations.length; index1 ++) {
		let destination1 = destinations[index1];
	// for (const destination1 of destinations) {
		for (let index2 = index1 + 1; index2 < destinations.length; index2 ++) {
			let destination2 = destinations[index2];
		// for (const destination2 of destinations) {
			// if (destination1 === destination2) continue;

			let obj = {};
			obj.time1 = 26 - paths.get('AA').get(destination1) - 1;
			obj.time2 = 26 - paths.get('AA').get(destination2) - 1;
			obj.destinations = new Set(destinations);
			obj.destinations.delete(destination1);
			obj.destinations.delete(destination2);
			obj.path1 = [destination1];
			obj.path2 = [destination2];
			obj.pressure = obj.time1 * rates.get(destination1) + obj.time2 * rates.get(destination2);
			dp.push(obj);
		}
	}
	// console.log(dp); return;
	// obj: time1, time2, destinations, path1, path2, pressure

	let maxPressure = 0;
	let maxObj;
	while (dp.length > 0) {
		let cur = dp.pop();
		if (/*cur.destinations.length === 0 &&*/ maxPressure < cur.pressure) {
			maxPressure = cur.pressure;
			maxObj = cur;
			// continue;
		}
		// if (cur.time1 > cur.time2) {
			for (const destination1 of cur.destinations) {
				let time1 = cur.time1;
				let distance1 = paths.get(cur.path1[cur.path1.length - 1]).get(destination1);
				if (time1 - distance1 <= 1) continue;

				let obj = {};
				obj.time1 = time1 - distance1 - 1;
				obj.time2 = cur.time2;
				obj.destinations = new Set([...cur.destinations]);
				obj.destinations.delete(destination1);
				obj.path1 = [...cur.path1, destination1];
				obj.path2 = [...cur.path2];
				obj.pressure = cur.pressure + obj.time1 * rates.get(destination1);
				dp.push(obj);
			}
		// } else /*if (cur.time2 > cur.time1)*/ {
			for (const destination2 of cur.destinations) {
				let time2 = cur.time2;
				let distance2 = paths.get(cur.path2[cur.path2.length - 1]).get(destination2);
				if (time2 - distance2 <= 1) continue;

				let obj = {};
				obj.time1 = cur.time1;
				obj.time2 = time2 - distance2 - 1;
				obj.destinations = new Set([...cur.destinations]);
				obj.destinations.delete(destination2);
				obj.path1 = [...cur.path1];
				obj.path2 = [...cur.path2, destination2];
				obj.pressure = cur.pressure + obj.time2 * rates.get(destination2);
				dp.push(obj);
			}
		// }
		/* else {
			let curDestinations = [...cur.destinations];
			for (let index1 = 0; index1 < curDestinations.length; index1 ++) {
				let destination1 = curDestinations[index1];
				for (let index2 = index1 + 1; index2 < curDestinations.length; index2 ++) {
					let destination2 = curDestinations[index2];

					let obj = {};
					obj.destinations = new Set([...cur.destinations]);
					obj.pressure = cur.pressure;

					let time1 = cur.time1;
					let time2 = cur.time2;
					let distance1 = paths.get(cur.path1[cur.path1.length - 1]).get(destination1);
					let distance2 = paths.get(cur.path2[cur.path2.length - 1]).get(destination2);

					if (time1 - distance1 <= 1 && time2 - distance2 <= 1) continue;

					if (time1 - distance1 <= 1) {
						obj.time1 = time1;
						obj.path1 = cur.path1;
					} else {

					}

					dp.push(obj);
				}
			}
		}*/
		// console.log(dp.length);
	}

	console.log(maxObj);
	return maxPressure;
}

// console.log('part 1:', getAnswer('./2022-16.sample.txt'), '(sample)'); // 1651
// console.log('part 1:', getAnswer('./2022-16.txt')); // 2181

// console.log('part 2:', getAnswer2('./2022-16.sample.txt'), '(sample)'); // 1707
console.log('part 2:', getAnswer2('./2022-16.txt')); // > 2786
