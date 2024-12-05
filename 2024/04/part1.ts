import { DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const puzzle = input.split('\n').map((line) => line.split(''));
	let result = 0;
	for (let row = 0; row < puzzle.length; row++) {
		for (let col = 0; col < puzzle[row].length; col++) {
			if (puzzle[row][col] === WORD[0]) {
				direction: for (const direction of DIRECTIONS) {
					const next = { row, col };
					for (let letter = 1; letter < WORD.length; letter++) {
						next.col += direction.x;
						next.row += direction.y;
						if (puzzle[next.row] === undefined || puzzle[next.row][next.col] !== WORD[letter]) {
							continue direction;
						}
					}
					result++;
				}
			}
		}
	}
	return result;
}

const WORD = ['X', 'M', 'A', 'S'];
