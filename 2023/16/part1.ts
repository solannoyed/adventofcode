import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	const grid = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((tile) => tile as Tile));

	return energisedCount({ x: 0, y: 0, direction: 1 }, grid);
}

export type Beam = {
	x: number;
	y: number;
	direction: number; // index of cardinal direction from `lib/directions`
};

export type Tile = '.' | '\\' | '/' | '|' | '-';

export function energisedCount(beam: Beam, grid: Tile[][]) {
	const energised: boolean[][] = [];
	for (const line of grid) {
		energised.push(new Array(line.length).fill(false));
	}

	const beams: Beam[] = [beam];
	const visited = new Set<string>();
	visited.add(getHash(beams[0]));
	energised[beam.y][beam.x] = true;

	while (beams.length > 0) {
		const current = beams.pop()!;
		const next = getBeams(current, grid);
		for (const beam of next) {
			if (beam.x < 0 || beam.y < 0 || beam.y >= grid.length || beam.x >= grid[beam.y].length)
				continue;
			const hash = getHash(beam);
			if (visited.has(hash)) continue;

			visited.add(hash);
			beams.push(beam);
			energised[beam.y][beam.x] = true;
		}
	}

	return energised.reduce(
		(accumulator, row) =>
			accumulator + row.reduce((accumulator, tile) => accumulator + (tile ? 1 : 0), 0),
		0
	);
}

function getHash(beam: Beam) {
	return `${beam.x},${beam.y},${beam.direction}`;
}

export function getBeams(beam: Beam, grid: Tile[][]) {
	const beams: Beam[] = [];
	switch (grid[beam.y][beam.x]) {
		case '.': {
			beams.push({
				x: beam.x + CARDINALS[beam.direction].x,
				y: beam.y + CARDINALS[beam.direction].y,
				direction: beam.direction
			});
			break;
		}
		case '-': {
			if (beam.direction % 2 > 0) {
				// left/right (horizontal)
				beams.push({
					x: beam.x + CARDINALS[beam.direction].x,
					y: beam.y,
					direction: beam.direction
				});
			} else {
				const directions = [1, 3];
				for (const direction of directions) {
					beams.push({
						x: beam.x + CARDINALS[direction].y,
						y: beam.y,
						direction
					});
				}
			}
			break;
		}
		case '|': {
			if (beam.direction % 2 == 0) {
				// up/down (verical)
				beams.push({
					x: beam.x,
					y: beam.y + CARDINALS[beam.direction].y,
					direction: beam.direction
				});
			} else {
				const directions = [0, 2];
				for (const direction of directions) {
					beams.push({
						x: beam.x,
						y: beam.y + CARDINALS[direction].y,
						direction
					});
				}
			}
			break;
		}
		case '/': {
			// in -> out
			// 1 -> 0 (right -> up)
			// 2 -> 3 (down -> left)
			// 3 -> 2 (left -> down)
			// 0 -> 3 (up -> right)
			const direction = beam.direction + (beam.direction % 2 > 0 ? -1 : 1);
			beams.push({
				x: beam.x + CARDINALS[direction].x,
				y: beam.y + CARDINALS[direction].y,
				direction
			});
			break;
		}
		case '\\': {
			// in -> out
			// 1 -> 2 (right -> down)
			// 2 -> 1 (down -> right)
			// 3 -> 0 (left -> up)
			// 0 -> 3 (up -> left)
			const direction = 3 - beam.direction;
			beams.push({
				x: beam.x + CARDINALS[direction].x,
				y: beam.y + CARDINALS[direction].y,
				direction
			});
			break;
		}
	}
	return beams;
}
