import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const visited: boolean[][] = [];
	for (let row = 0; row < grid.length; row++) visited.push(new Array(grid[row].length).fill(false));

	const regions = new Array<Region>();
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (visited[row][col]) continue;
			visited[row][col] = true;

			// NOTE: counting visited and increasing area when inserted into the queue but calculating perimeter when removing from queue
			const region: Region = {
				value: grid[row][col],
				area: 1,
				perimeter: 0
			};
			regions.push(region);
			const queue: Position[] = [{ row, col }];
			while (queue.length > 0) {
				const position = queue.pop()!;
				for (const direction of DIRECTIONS) {
					const destination = {
						row: position.row + direction.y,
						col: position.col + direction.x
					};
					if (
						destination.row < 0 ||
						destination.row >= grid.length ||
						destination.col < 0 ||
						destination.col >= grid[row].length ||
						grid[position.row][position.col] !== grid[destination.row][destination.col]
					) {
						region.perimeter++;
						continue;
					}

					if (visited[destination.row][destination.col]) continue;

					queue.push(destination);
					visited[destination.row][destination.col] = true;
					region.area++;
				}
			}
		}
	}

	return regions.reduce((accumulator, value) => {
		return accumulator + value.area * value.perimeter;
	}, 0);
}

interface Position {
	row: number;
	col: number;
}

interface Region {
	value: string;
	area: number;
	perimeter: number;
}
