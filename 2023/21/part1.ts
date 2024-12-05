import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	const plot = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((tile) => tile as Tile));

	const mid = (plot.length - 1) / 2;
	const start = {
		x: mid,
		y: mid
	};
	const steps = 64;
	return countReachable(plot, start, steps);
}

export function countReachable(plot: Tile[][], start: { x: number; y: number }, steps: number) {
	const visited: boolean[][] = [];
	for (let row = 0; row < plot.length; row++) {
		visited.push(new Array(plot[row].length).fill(false));
	}
	visited[start.y][start.x] = true;
	const count = [1, 0];
	let queue = [start];
	for (let step = 1; step <= steps; step++) {
		const next: typeof queue = [];
		for (const current of queue) {
			for (const direction of CARDINALS) {
				const position: typeof current = {
					x: current.x + direction.x,
					y: current.y + direction.y
				};
				if (!plot[position.y] || !plot[position.y][position.x] || plot[position.y][position.x] == '#') continue;
				if (visited[position.y][position.x]) continue;
				count[step % 2]++;
				visited[position.y][position.x] = true;
				next.push(position);
			}
		}
		queue = next;
	}
	return count[steps % 2];
}

type Tile = 'S' | '.' | '#';
