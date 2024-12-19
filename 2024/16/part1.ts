import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const maze = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const start = { row: 0, col: 0, direction: 1, score: 0 };
	const end = { row: 0, col: 0 };
	search: for (let row = 1; row < maze.length - 1; row++) {
		for (let col = 1; col < maze[row].length - 1; col++) {
			if (maze[row][col] === 'S') {
				start.row = row;
				start.col = col;
				if (end.row !== 0) break search;
			}
			if (maze[row][col] === 'E') {
				end.row = row;
				end.col = col;
				if (start.row !== 0) break search;
			}
		}
	}

	let score = Number.MAX_SAFE_INTEGER;

	const visited = new Map<string, number>();
	visited.set(cellHash(start), 0);
	const queue = [start];
	while (queue.length > 0) {
		const current = queue.shift()!;
		if (current.score > score) continue;
		if (current.row === end.row && current.col === end.col) {
			if (current.score < score) score = current.score;
			continue;
		}

		// straight
		let destination = {
			row: current.row + DIRECTIONS[current.direction].y,
			col: current.col + DIRECTIONS[current.direction].x,
			direction: current.direction,
			score: current.score + 1
		};
		let hash = cellHash(destination);
		let visit = visited.get(hash);
		if (maze[destination.row][destination.col] !== '#' && (visit === undefined || visit > destination.score)) {
			visited.set(hash, destination.score);
			queue.push(destination);
		}
		// left
		destination = {
			row: current.row,
			col: current.col,
			direction: (current.direction + DIRECTIONS.length - 1) % DIRECTIONS.length,
			score: current.score + 1000
		};
		hash = cellHash(destination);
		visit = visited.get(hash);
		if (visit === undefined || visit > destination.score) {
			visited.set(hash, destination.score);
			queue.push(destination);
		}
		// right
		destination = {
			row: current.row,
			col: current.col,
			direction: (current.direction + 1) % DIRECTIONS.length,
			score: current.score + 1000
		};
		hash = cellHash(destination);
		visit = visited.get(hash);
		if (visit === undefined || visit > destination.score) {
			visited.set(hash, destination.score);
			queue.push(destination);
		}
	}

	return score;
}

function cellHash({ row, col, direction }: { row: number; col: number; direction: number }) {
	return `${row},${col},${direction}`;
}
