export default function (input: string) {
	const inputs = input
		.trim()
		.split('\n')
		.map((line) => {
			return line.split('   ');
		});
	const first = inputs.map((input) => parseInt(input[0])).sort((a, b) => a - b);
	const second = inputs.map((input) => parseInt(input[1])).sort((a, b) => a - b);

	let diff = 0;
	for (let index = 0; index < first.length; index++) {
		diff += Math.abs(first[index] - second[index]);
	}

	return diff;
}
