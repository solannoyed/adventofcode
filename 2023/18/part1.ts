import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	const plan = input
		.trim()
		.split('\n')
		.map((line) => line.split(' '))
		.map(([direction, length, colour]) => {
			return {
				direction: getCardinalDirection(direction)!,
				length: parseInt(length)
			};
		});

	let current = { x: 0, y: 0 };
	let min = { x: 0, y: 0 };
	let max = { x: 0, y: 0 };
	for (const { direction, length } of plan) {
		current.x += length * CARDINALS[direction].x;
		current.y += length * CARDINALS[direction].y;
		min.x = Math.min(min.x, current.x);
		min.y = Math.min(min.y, current.y);
		max.x = Math.max(max.x, current.x);
		max.y = Math.max(max.y, current.y);
	}

	const grid: boolean[][] = new Array(max.y - min.y + 1);
	for (let row = 0; row < grid.length; row++) {
		grid[row] = new Array(max.x - min.x + 1).fill(false);
	}

	current = { x: 0 - min.x, y: 0 - min.y };
	for (const { direction, length } of plan) {
		grid[current.y][current.x] = true;
		for (let step = 0; step < length; step++) {
			current.x += CARDINALS[direction].x;
			current.y += CARDINALS[direction].y;
			grid[current.y][current.x] = true;
		}
	}

	const queue = [{ x: 1 - min.x, y: 1 - min.y }];
	while (queue.length > 0) {
		const location = queue.pop()!;
		grid[location.y][location.x] = true;
		for (const direction of [0, 1, 2, 3]) {
			const next = {
				x: location.x + CARDINALS[direction].x,
				y: location.y + CARDINALS[direction].y
			};
			if (!grid[next.y][next.x]) queue.push(next);
		}
	}
	return grid.map((row) => row.filter((item) => item).length).reduce((acc, val) => acc + val);
}

function getCardinalDirection(direction: string) {
	switch (direction) {
		case 'U':
			return 0;
		case 'R':
			return 1;
		case 'D':
			return 2;
		case 'L':
			return 3;
	}
}
