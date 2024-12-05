import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	return getArea(
		input
			.trim()
			.split('\n')
			.map((line) => line.split(' '))
			.map(([, , colour]) => {
				return {
					direction: (parseInt(colour[7]) + 1) % 4,
					length: parseInt(colour.substring(2, 7), 16)
				};
			})
	);
}

function getArea(plan: { direction: number; length: number }[]) {
	let current = { x: 0, y: 0 };
	let area = 0;
	let perimeter = 0;

	for (const { direction, length } of plan) {
		const next = {
			x: current.x + CARDINALS[direction].x * length,
			y: current.y + CARDINALS[direction].y * length
		};
		// calculate the area with shoelace formula
		// inputs are clockwise loops which give a negative area
		// take the negative (`b - a` instead of `a - b`) rather than adding `Math.abs(area)`
		area += current.x * next.y - next.x * current.y;
		perimeter += length;
		current = next;
	}

	// 1. `area` (above) is actually `2 * area`
	// 2. half the perimeter is inside `area`
	// 3. there are 4 extra quarters at the outer corners
	return area / 2 + perimeter / 2 + 1;
}
