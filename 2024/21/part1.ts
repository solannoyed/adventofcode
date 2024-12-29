export default function (input: string) {
	const codes = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((char) => (char === 'A' ? 2 : char === '0' ? 1 : parseInt(char) + 2)));

	let result = 0;
	codes.forEach((code) => {
		let current = 2;
		let sequences: number[][] = [];
		for (const val of code) {
			sequences.push(numToDirection(current, val));
			current = val;
		}
		let directions = sequences.flat();

		// `A` on the numpad is `2`, but `A` on the dpad is `5`
		current = 5;

		for (let robot = 0; robot < 2; robot++) {
			sequences = [];
			for (const val of directions) {
				sequences.push(directionToDirection(current, val));
				current = val;
			}
			directions = sequences.flat();
		}
		result += directions.length * codeNumeric(code);
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
