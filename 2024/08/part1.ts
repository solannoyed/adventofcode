export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));
	const locations = new Map<string, { row: number; col: number }[]>();
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] !== '.') {
				if (!locations.has(grid[row][col])) locations.set(grid[row][col], []);
				locations.get(grid[row][col])!.push({ row, col });
			}
		}
	}
	const antinodes = new Set<string>();
	for (const nodes of locations.values()) {
		for (let first = 0; first < nodes.length; first++) {
			for (let second = 0; second < nodes.length; second++) {
				if (first === second) continue;
				const antinode = {
					row: 2 * nodes[first].row - nodes[second].row,
					col: 2 * nodes[first].col - nodes[second].col
				};
				if (
					antinode.row >= 0 &&
					antinode.row < grid.length &&
					antinode.col >= 0 &&
					antinode.col < grid[antinode.row].length
				) {
					antinodes.add(`${antinode.row},${antinode.col}`);
				}
			}
		}
	}
	return antinodes.size;
}
