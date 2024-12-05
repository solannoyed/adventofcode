import { DIRECTIONS } from 'lib/directions';
import { isDigit } from 'lib/digits';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const symbolLocations = new Array<{ row: number; col: number }>();
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (isDigit(grid[row][col])) {
				continue;
			} else if (grid[row][col] == '.') {
				continue;
			}
			symbolLocations.push({ row, col });
		}
	}
	let result = 0;
	for (const location of symbolLocations) {
		grid[location.row][location.col] = '.';
		for (const direction of DIRECTIONS) {
			let destination = { row: location.row + direction.x, col: location.col + direction.y };
			// make sure the destination is inside the grid
			if (
				destination.row < 0 ||
				destination.row >= grid.length ||
				destination.col < 0 ||
				destination.col >= grid[destination.row].length
			) {
				continue;
			}
			// if we have a number, add it to our result
			if (isDigit(grid[destination.row][destination.col])) {
				let startIndex = destination.col;
				let endIndex = destination.col;
				while (startIndex > 0 && isDigit(grid[destination.row][startIndex - 1])) {
					startIndex--;
				}
				while (
					endIndex < grid[destination.row].length - 1 &&
					isDigit(grid[destination.row][endIndex + 1])
				) {
					endIndex++;
				}
				result += parseInt(grid[destination.row].slice(startIndex, endIndex + 1).join(''));
				// remove the number
				for (let col = startIndex; col <= endIndex; col++) {
					grid[destination.row][col] = '.';
				}
			}
		}
	}
	return result;
}
