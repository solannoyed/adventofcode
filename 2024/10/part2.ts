import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((num) => parseInt(num)));

	const ratings: typeof grid = [];
	const queue: Position[] = [];
	const trailheads: Position[] = [];
	for (let row = 0; row < grid.length; row++) {
		ratings.push(new Array(grid[row].length).fill(0));
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === 9) {
				ratings[row][col]++;
				queue.push({ row, col });
			} else if (grid[row][col] === 0) trailheads.push({ row, col });
		}
	}

	const visited = new Set<string>();
	while (queue.length > 0) {
		const position = queue.shift()!;
		const rating = ratings[position.row][position.col];
		for (const direction of DIRECTIONS) {
			const destination: Position = {
				row: position.row + direction.y,
				col: position.col + direction.x
			};
			const destinationHash = `${destination.row},${destination.col}`;
			if (
				destination.row < 0 ||
				destination.row >= grid.length ||
				destination.col < 0 ||
				destination.col >= grid[destination.row].length ||
				grid[destination.row][destination.col] != grid[position.row][position.col] - 1
			)
				continue;
			ratings[destination.row][destination.col] += rating;
			if (visited.has(destinationHash)) continue;
			visited.add(destinationHash);
			queue.push(destination);
		}
	}

	let result = 0;
	for (const trailhead of trailheads) {
		result += ratings[trailhead.row][trailhead.col];
	}
	return result;
}

interface Position {
	row: number;
	col: number;
}
