import { CARDINALS as DIRECTIONS } from 'lib/directions';

export default function (input: string) {
	const size = input.length === 100 ? 7 : 71;
	let byteCount = input.length === 100 ? 12 : 1024;

	const bytes = input
		.trim()
		.split('\n')
		.map((line) => {
			const [col, row] = line.split(',').map((value) => parseInt(value));
			return { col, row };
		});

	let path = shortestPath(setupGrid(size, bytes, byteCount));
	do {
		while (
			byteCount < bytes.length &&
			!path!.has(positionIndex(bytes[byteCount - 1].row, bytes[byteCount - 1].col, size))
		)
			byteCount++;
		path = shortestPath(setupGrid(size, bytes, byteCount));
	} while (path !== undefined && byteCount < bytes.length);

	return `${bytes[byteCount - 1].col},${bytes[byteCount - 1].row}`;
}

function shortestPath(grid: number[][]) {
	const queue = [{ row: 0, col: 0, path: new Set([0]) }];
	let shortestPath: Set<number> | undefined;
	while (queue.length > 0) {
		const current = queue.shift()!;
		for (const direction of DIRECTIONS) {
			const row = current.row + direction.y;
			const col = current.col + direction.x;
			if (grid[current.row][current.col] + 1 < grid[row]?.[col]) {
				grid[row][col] = grid[current.row][current.col] + 1;
				const path = new Set([...current.path, positionIndex(row, col, grid.length)]);
				if (row === grid.length - 1 && col === grid.length - 1) shortestPath = path;
				queue.push({
					row,
					col,
					path
				});
			}
		}
	}
	return shortestPath;
}

function positionIndex(row: number, col: number, size: number) {
	return row * size + col;
}

function setupGrid(size: number, bytes: { col: number; row: number }[], byteCount: number): number[][] {
	const grid: number[][] = [];
	for (let y = 0; y < size; y++) grid.push(new Array(size).fill(Infinity));
	for (let byte = 0; byte < byteCount; byte++) grid[bytes[byte].row][bytes[byte].col] = -1;
	grid[0][0] = 0;
	return grid;
}
