export default function (input: string) {
	let count = 0;
	input
		.trim()
		.split('\n')
		.map((line) => {
			return line.split(' ').map((val) => parseInt(val));
		})
		.forEach((record) => {
			let lower = 1,
				upper = 3;
			if (record[0] > record[1]) {
				lower = -3;
				upper = -1;
			}
			for (let index = 0; index < record.length - 1; index++) {
				if (record[index] + lower > record[index + 1] || record[index] + upper < record[index + 1]) return;
			}
			count++;
		});
	return count;
}
