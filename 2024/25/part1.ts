export default function (input: string) {
	const inputParts = input
		.trim()
		.split('\n\n')
		.map((group) => group.split('\n').map((line) => line.split('')));
	const keys = inputParts.filter((lines) => lines[0][0] === '.').map(getHeights);
	const locks = inputParts.filter((lines) => lines[0][0] === '#').map(getHeights);

	const heights: { keys: Set<number>; locks: Set<number> }[][] = [[], [], [], [], []];
	for (let pin = 0; pin < 5; pin++) {
		for (let height = 0; height < 6; height++) {
			heights[pin].push({ keys: new Set(), locks: new Set() });

			for (let key = 0; key < keys.length; key++) {
				if (keys[key][pin] >= height) {
					heights[pin][height].keys.add(key);
				}
			}

			for (let lock = 0; lock < locks.length; lock++) {
				if (locks[lock][pin] <= height) {
					heights[pin][height].locks.add(lock);
				}
			}
		}
	}

	let result = 0;
	key: for (const key of keys) {
		let locks = heights[0][5 - key[0]].locks;
		for (let pin = 1; pin < 5; pin++) {
			locks = locks.intersection(heights[pin][5 - key[pin]].locks);
			if (locks.size === 0) continue key;
		}
		result += locks.size;
	}

	return result;
}

function getHeights(group: string[][]) {
	const heights = new Array(5).fill(-1);
	for (const line of group) for (let pin = 0; pin < line.length; pin++) if (line[pin] === '#') heights[pin]++;
	return heights;
}
