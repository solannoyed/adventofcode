export default function (input: string) {
	const puzzle = input.split('\n').map((line) => line.split(''));
	let result = 0;
	for (let row = 1; row < puzzle.length - 1; row++) {
		for (let col = 1; col < puzzle[row].length - 1; col++) {
			if (puzzle[row][col] === 'A') {
				if (
					puzzle[row - 1][col - 1] !== puzzle[row + 1][col + 1] &&
					(puzzle[row - 1][col - 1] === 'M' || puzzle[row - 1][col - 1] === 'S') &&
					(puzzle[row + 1][col + 1] === 'M' || puzzle[row + 1][col + 1] === 'S') &&
					puzzle[row + 1][col - 1] !== puzzle[row - 1][col + 1] &&
					(puzzle[row + 1][col - 1] === 'M' || puzzle[row + 1][col - 1] === 'S') &&
					(puzzle[row - 1][col + 1] === 'M' || puzzle[row - 1][col + 1] === 'S')
				)
					result++;
			}
		}
	}
	return result;
}
