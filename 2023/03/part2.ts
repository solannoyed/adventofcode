export default function (input: string) {
	let grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	let gearLocations = new Array<{ row: number; col: number }>();
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] == '*') {
				gearLocations.push({ row, col });
			}
		}
	}
	let result = 0;
	for (const location of gearLocations) {
		grid[location.row][location.col] = '.';
		const parts = new Map<string, { row: number; col: number; length: number }>();
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
			// if we have a number, add it the parts list
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
				parts.set(`${destination.row},${startIndex}`, {
					row: destination.row,
					col: startIndex,
					length: endIndex - startIndex + 1
				});
			}
		}
		if (parts.size == 2) {
			let gearRatio = 1;
			parts.forEach((part) => {
				gearRatio *= parseInt(grid[part.row].slice(part.col, part.col + part.length).join(''));
			});
			result += gearRatio;
		}
	}
	return result;
}

const DIRECTIONS = [
	{ x: -1, y: -1 },
	{ x: 0, y: -1 },
	{ x: 1, y: -1 },
	{ x: 1, y: 0 },
	{ x: 1, y: 1 },
	{ x: 0, y: 1 },
	{ x: -1, y: 1 },
	{ x: -1, y: 0 }
];

function isDigit(char: string) {
	return char.length == 1 && char >= '0' && char <= '9';
}
