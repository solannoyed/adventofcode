export default function (input: string) {
	let result = 0;
	for (const line of input.trim().split('\n')) {
		const [winning, selected] = line
			.substring(line.indexOf(':') + 1)
			.split('|')
			.map((numbers) =>
				numbers
					.trim()
					.split(' ')
					.filter((number) => number.length > 0)
					.map((number) => parseInt(number))
			);
		let count = selected.filter((number) => winning.includes(number)).length;
		if (count > 0) {
			result += 2 ** (count - 1);
		}
	}
	return result;
}

