export default function (input: string) {
	const codes = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((char) => (char === 'A' ? 2 : char === '0' ? 1 : parseInt(char) + 2)));

	// sample vs non-sample
	const ROBOTS = input.startsWith('029A') ? 2 : 25;

	const cache = new Map<string, { sequence: number[]; count: number }[]>();
	let result = 0;
	codes.forEach((code) => {
		let current = 2; // `A` on the numpad

		let sequences = new Map<string, { sequence: number[]; count: number }>();
		for (const val of code) {
			const sequence = numToDirection(current, val);
			const hash = sequence.join(',');

			if (!sequences.has(hash)) sequences.set(hash, { sequence, count: 1 });
			else sequences.get(hash)!.count++;

			current = val;
		}
		// `A` on the numpad is `2`, but `A` on the dpad is `5`
		current = 5;

		for (let robot = 0; robot < ROBOTS; robot++) {
			const next: typeof sequences = new Map();

			sequences.forEach(({ sequence: currentSequence, count: currentCount }, hash) => {
				if (cache.has(hash)) {
					// console.log('cache has hash', hash);
					cache.get(hash)!.forEach(({ sequence: nextSequence, count: nextCount }) => {
						const nextHash = nextSequence.join(',');
						if (!next.has(nextHash)) next.set(nextHash, { sequence: nextSequence, count: currentCount * nextCount });
						else next.get(nextHash)!.count += currentCount * nextCount;
					});
					return;
				}

				const nextCache: { sequence: number[]; count: number }[] = [];
				const nextCacheMap = new Map<string, number>();
				for (const val of currentSequence) {
					const sequence = directionToDirection(current, val);
					current = val;

					const sequenceHash = sequence.join(',');

					if (!next.has(sequenceHash)) next.set(sequenceHash, { sequence, count: currentCount });
					else next.get(sequenceHash)!.count += currentCount;

					if (nextCacheMap.has(sequenceHash)) nextCache[nextCacheMap.get(sequenceHash)!].count++;
					else {
						nextCacheMap.set(sequenceHash, nextCache.length);
						nextCache.push({ sequence, count: 1 });
					}
				}
				cache.set(hash, nextCache);
			});

			sequences = next;
		}

		result +=
			sequences.values().reduce((accumulator, { sequence, count }) => accumulator + sequence.length * count, 0) *
			codeNumeric(code);
	});
	return result;
}

function codeNumeric(code: number[]) {
	let result = 0;
	for (let i = 0; i < code.length - 1; i++) {
		result *= 10;
		result += keyNumeric(code[i]);
	}
	return result;
}

function keyNumeric(key: number) {
	if (key >= 2) return key - 2;
	else return 0;
}

function numToDirection(start: number, end: number) {
	const from = keyPosition(start);
	const to = keyPosition(end);

	const horizontal: number[] = new Array(Math.abs(from.x - to.x)).fill(from.x < to.x ? 2 : 0);
	const vertical: number[] = new Array(Math.abs(from.y - to.y)).fill(from.y < to.y ? 4 : 1);

	// make sure to not go over empty space
	if (from.y === 0 && to.x === 0) return [...vertical, ...horizontal, 5];
	if (from.x === 0 && to.y === 0) return [...horizontal, ...vertical, 5];

	// going horizontal first seems to only be more efficient if going left
	if (to.x < from.x) return [...horizontal, ...vertical, 5];
	return [...vertical, ...horizontal, 5];
}

function directionToDirection(start: number, end: number) {
	const from = keyPosition(start);
	const to = keyPosition(end);

	const horizontal: number[] = new Array(Math.abs(from.x - to.x)).fill(from.x < to.x ? 2 : 0);
	const vertical: number[] = new Array(Math.abs(from.y - to.y)).fill(from.y < to.y ? 4 : 1);

	// make sure to not go over empty space
	if (to.x === 0) return [...vertical, ...horizontal, 5];
	if (from.x === 0) return [...horizontal, ...vertical, 5];

	// going horizontal first seems to only be more efficient if going left
	if (to.x < from.x) return [...horizontal, ...vertical, 5];
	return [...vertical, ...horizontal, 5];
}

function keyPosition(num: number) {
	const x = num % 3;
	return {
		x,
		y: (num - x) / 3
	};
}
