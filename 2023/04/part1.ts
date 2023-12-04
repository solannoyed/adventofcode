export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) =>
			line
				.substring(line.indexOf(':') + 1)
				.split('|')
				.map((numbers) =>
					numbers
						.split(' ')
						.filter((num) => num.length > 0)
						.map((num) => parseInt(num))
				)
		)
		.map(([winning, selected]) => selected.filter((number) => winning.includes(number)).length)
		.reduce((previous, current) => previous + ((1 << current) >> 1), 0);
}
