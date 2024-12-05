import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	const blocks = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((block) => parseInt(block)));
	const coolest: number[][][] = new Array(blocks.length); // x, y, vertical/horizontal
	for (let row = 0; row < coolest.length; row++) {
		coolest[row] = new Array(blocks[row].length);
		for (let col = 0; col < coolest[row].length; col++) {
			coolest[row][col] = new Array(2).fill(Infinity);
		}
	}

	const queue: Crucible[] = [
		{ x: 0, y: 0, direction: 1, heat: 0 },
		{ x: 0, y: 0, direction: 2, heat: 0 }
	];
	while (queue.length > 0) {
		const current = queue.shift()!; // make sure to do BFS

		for (const distance of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
			current.x += CARDINALS[current.direction].x;
			current.y += CARDINALS[current.direction].y;
			if (!blocks[current.y] || !blocks[current.y][current.x]) break; // outside the grid
			current.heat += blocks[current.y][current.x];

			if (distance < 4) continue;
			if (coolest[current.y][current.x][(current.direction + 1) % 2] <= current.heat) continue;

			queue.push({
				x: current.x,
				y: current.y,
				direction: (current.direction + 3) % 4, // left turn
				heat: current.heat
			});
			queue.push({
				x: current.x,
				y: current.y,
				direction: (current.direction + 1) % 4, // right turn
				heat: current.heat
			});
			coolest[current.y][current.x][(current.direction + 1) % 2] = current.heat;
		}
	}

	return Math.min(...coolest.at(-1)!.at(-1)!);
}

interface Crucible {
	x: number; // column in the city blocks
	y: number; // row in the city blocks
	direction: number; // cardinal direction index
	heat: number; // the amount of heat lost in the trip
}
