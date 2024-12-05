import { DIGITS } from 'lib/digits';

export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			const first = {
				index: line.length,
				value: 0
			};
			const last = {
				index: -1,
				value: 0
			};
			for (const number of DIGITS) {
				let index = line.indexOf(number.string);
				if (index < 0) continue;
				if (index < first.index) {
					first.index = index;
					first.value = number.value;
				}
				index = line.lastIndexOf(number.string);
				if (index > last.index) {
					last.index = index;
					last.value = number.value;
				}
			}
			return first.value * 10 + last.value;
		})
		.reduce((sum, value) => sum + value);
}
