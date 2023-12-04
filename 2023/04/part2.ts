export default function (input: string) {
	const lines = input.trim().split('\n');
	const cards = new Array<number>(lines.length).fill(1);
	for (let line = 0; line < lines.length; line++) {
		const [winning, selected] = lines[line]
			.substring(lines[line].indexOf(':') + 1)
			.split('|')
			.map((numbers) =>
				numbers
					.trim()
					.split(' ')
					.filter((number) => number.length > 0)
					.map((number) => parseInt(number))
			);
		const count = selected.filter((number) => winning.includes(number)).length;
		for (let card = line + 1; card <= line + count; card++) {
			cards[card] += cards[line];
		}
	}
	return cards.reduce((accumulator, value) => accumulator + value);
}
