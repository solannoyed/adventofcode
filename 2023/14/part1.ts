export default function (input: string) {
	const lines = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	let total = 0;
	for (let col = 0; col < lines[0].length; col++) {
		let index = 0; // this is where the next rock will be pushed to
		for (let row = 0; row < lines.length; row++) {
			if (lines[row][col] == '#') {
				index = row + 1;
			} else if (lines[row][col] == 'O') {
				total += lines.length - index;
				index++;
			}
		}
	}
	return total;
}
