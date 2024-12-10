import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((num) => parseInt(num)));

	let result = 0;
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			result += trails(grid, { row, col });
		}
	}
	return result;
}

function trails(grid: number[][], start: { row: number; col: number }) {
	let queue = [start];
	for (let height = 0; height < 9; height++) {
		const visited = new Set<string>();
		const next: typeof queue = [];
		for (const position of queue) {
			for (const direction of DIRECTIONS) {
				const destination = {
					row: position.row + direction.y,
					col: position.col + direction.x
				};
				if (
					destination.row < 0 ||
					destination.row >= grid.length ||
					destination.col < 0 ||
					destination.col >= grid[destination.row].length ||
					grid[destination.row][destination.col] != grid[position.row][position.col] + 1
				)
					continue;
				const destinationHash = `${destination.row},${destination.col}`;
				if (visited.has(destinationHash)) continue;
				visited.add(destinationHash);
				next.push(destination);
			}
		}
		queue = next;
	}
	return queue.length;
}
