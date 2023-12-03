// It would be nice to just use the exact same function as part 1, but `const NUMS` is different and it wont use the one in this file.
// import process from './part1';
// export default process;

const NUMS = [
	{ string: '1', value: 1 },
	{ string: 'one', value: 1 },
	{ string: '2', value: 2 },
	{ string: 'two', value: 2 },
	{ string: '3', value: 3 },
	{ string: 'three', value: 3 },
	{ string: '4', value: 4 },
	{ string: 'four', value: 4 },
	{ string: '5', value: 5 },
	{ string: 'five', value: 5 },
	{ string: '6', value: 6 },
	{ string: 'six', value: 6 },
	{ string: '7', value: 7 },
	{ string: 'seven', value: 7 },
	{ string: '8', value: 8 },
	{ string: 'eight', value: 8 },
	{ string: '9', value: 9 },
	{ string: 'nine', value: 9 }
];

export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			let first = {
				index: line.length,
				value: 0
			};
			let last = {
				index: -1,
				value: 0
			};
			for (const num of NUMS) {
				let index = line.indexOf(num.string);
				if (index < 0) continue;
				if (index < first.index) {
					first.index = index;
					first.value = num.value;
				}
				index = line.lastIndexOf(num.string);
				if (index > last.index) {
					last.index = index;
					last.value = num.value;
				}
			}
			return first.value * 10 + last.value;
		})
		.reduce((sum, value) => sum + value);
}
