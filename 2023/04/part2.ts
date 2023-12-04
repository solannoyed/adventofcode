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
						.filter((number) => number.length > 0)
						.map((number) => parseInt(number))
				)
		)
		.map(([winning, selected]) => {
			return { count: 1, wins: selected.filter((number) => winning.includes(number)).length };
		})
		.map(({ count, wins }, index, cards) => {
			for (let card = index + wins; card > index; card--) {
				cards[card].count += count;
			}
			return count;
		})
		.reduce((accumulator, value) => accumulator + value);
}
