import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const maze = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const start = { row: 0, col: 0, direction: 1, score: 0, dHash: '', pHash: '' };
	const end = { row: 0, col: 0, pHash: '' };
	search: for (let row = 1; row < maze.length - 1; row++) {
		for (let col = 1; col < maze[row].length - 1; col++) {
			if (maze[row][col] === 'S') {
				start.row = row;
				start.col = col;
				start.pHash = cellPositionalHash(start);
				start.dHash = cellDirectionalHash(start);
				if (end.row !== 0) break search;
			}
			if (maze[row][col] === 'E') {
				end.row = row;
				end.col = col;
				end.pHash = cellPositionalHash(end);
				if (start.row !== 0) break search;
			}
		}
	}

	let score = Number.MAX_SAFE_INTEGER;

	const visited = new Map<string, { score: number; cells: Set<string> }>();
	visited.set(start.dHash, { score: 0, cells: new Set([start.pHash]) });
	const queue = [start];
	while (queue.length > 0) {
		const current = queue.shift()!;
		if (current.score > score) continue;
		if (current.row === end.row && current.col === end.col) {
			if (current.score === score)
				visited.get(end.pHash)!.cells = new Set([
					...visited.get(end.pHash)!.cells,
					...visited.get(current.pHash)!.cells
				]);
			if (current.score < score) {
				score = current.score;
				visited.set(end.pHash, visited.get(current.dHash)!);
			}
			continue;
		}

		// straight
		let destination: typeof current = {
			row: current.row + DIRECTIONS[current.direction].y,
			col: current.col + DIRECTIONS[current.direction].x,
			direction: current.direction,
			score: current.score + 1,
			pHash: '',
			dHash: ''
		};
		destination.pHash = cellPositionalHash(destination);
		destination.dHash = cellDirectionalHash(destination);
		let visit = visited.get(destination.dHash);
		if (maze[destination.row][destination.col] !== '#') {
			if (visit === undefined || visit.score > destination.score) {
				visited.set(destination.dHash, {
					score: destination.score,
					cells: new Set([...visited.get(current.dHash)!.cells, destination.pHash])
				});
				queue.push(destination);
			} else if (visit.score === destination.score) {
				const union = new Set([...visit.cells, ...visited.get(current.dHash)!.cells]);
				if (union.size > visit.cells.size) {
					visit.cells = union;
					queue.push(destination);
				}
			}
		}

		// left
		destination = {
			row: current.row,
			col: current.col,
			direction: (current.direction + DIRECTIONS.length - 1) % DIRECTIONS.length,
			score: current.score + 1000,
			pHash: '',
			dHash: ''
		};
		destination.pHash = cellPositionalHash(destination);
		destination.dHash = cellDirectionalHash(destination);
		visit = visited.get(destination.dHash);
		if (visit === undefined || visit.score > destination.score) {
			visited.set(destination.dHash, {
				score: destination.score,
				cells: new Set([...visited.get(current.dHash)!.cells, destination.pHash])
			});
			queue.push(destination);
		} else if (visit.score === destination.score) {
			const union = new Set([...visit.cells, ...visited.get(current.dHash)!.cells]);
			if (union.size > visit.cells.size) {
				visit.cells = union;
				queue.push(destination);
			}
		}

		// right
		destination = {
			row: current.row,
			col: current.col,
			direction: (current.direction + 1) % DIRECTIONS.length,
			score: current.score + 1000,
			pHash: '',
			dHash: ''
		};
		destination.pHash = cellPositionalHash(destination);
		destination.dHash = cellDirectionalHash(destination);
		visit = visited.get(destination.dHash);
		if (visit === undefined || visit.score > destination.score) {
			visited.set(destination.dHash, {
				score: destination.score,
				cells: new Set([...visited.get(current.dHash)!.cells, destination.pHash])
			});
			queue.push(destination);
		} else if (visit.score === destination.score) {
			const union = new Set([...visit.cells, ...visited.get(current.dHash)!.cells]);
			if (union.size > visit.cells.size) {
				visit.cells = union;
				queue.push(destination);
			}
		}
	}

	return visited.get(end.pHash)?.cells.size ?? 0;
}

function cellDirectionalHash({ row, col, direction }: { row: number; col: number; direction: number }) {
	return `${row},${col},${direction}`;
}

function cellPositionalHash({ row, col }: { row: number; col: number }) {
	return `${row},${col}`;
}
