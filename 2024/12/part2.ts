import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const visited: number[][] = [];
	for (let row = 0; row < grid.length; row++) visited.push(new Array(grid[row].length).fill(-1));

	const regions = new Array<Region>();
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (visited[row][col] >= 0) continue;

			const region: Region = {
				index: regions.length,
				value: grid[row][col],
				area: 1,
				edges: 0
			};
			visited[row][col] = region.index;
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
						grid[position.row][position.col] !== grid[destination.row][destination.col] ||
						visited[destination.row][destination.col] >= 0
					)
						continue;

					queue.push(destination);
					visited[destination.row][destination.col] = region.index;
					region.area++;
				}
			}
		}
	}

	// find the horizontal edges
	for (let row = 0; row <= grid.length; row++) {
		let edge = {
			up: -1,
			down: -1
		};
		for (let col = 0; col < grid[0].length; col++) {
			const next = {
				up: row === 0 ? -1 : visited[row - 1][col],
				down: row === grid.length ? -1 : visited[row][col]
			};
			if (next.up !== next.down) {
				if (next.up >= 0 && (edge.up === edge.down || edge.up !== next.up)) regions[next.up].edges++;
				if (next.down >= 0 && (edge.up === edge.down || edge.down !== next.down)) regions[next.down].edges++;
			}
			edge = next;
		}
	}
	// find the vertical edges
	for (let col = 0; col <= grid[0].length; col++) {
		let edge = {
			left: -1,
			right: -1
		};
		for (let row = 0; row < grid.length; row++) {
			const next = {
				left: col === 0 ? -1 : visited[row][col - 1],
				right: col === grid[row].length ? -1 : visited[row][col]
			};
			if (next.left !== next.right) {
				if (next.left >= 0 && (edge.left === edge.right || edge.left !== next.left)) regions[next.left].edges++;
				if (next.right >= 0 && (edge.left === edge.right || edge.right !== next.right)) regions[next.right].edges++;
			}
			edge = next;
		}
	}

	return regions.reduce((accumulator, value) => {
		return accumulator + value.area * value.edges;
	}, 0);
}

interface Position {
	row: number;
	col: number;
}

interface Region {
	index: number;
	value: string;
	area: number;
	edges: number;
}
