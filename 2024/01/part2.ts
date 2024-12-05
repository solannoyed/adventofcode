export default function (input: string) {
	const inputs = input
		.trim()
		.split('\n')
		.map((line) => {
			return line.split('   ').map((val) => parseInt(val));
		});
	const counts = new Map();
	for (const [, value] of inputs) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	let result = 0;
	for (const [value] of inputs) {
		result += value * (counts.get(value) ?? 0);
	}
	return result;
}
