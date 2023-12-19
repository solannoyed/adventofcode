import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	return getArea(
		input
			.trim()
			.split('\n')
			.map((line) => line.split(' '))
			.map(([direction, length, colour]) => {
				return {
					direction: (parseInt(colour[7]) + 1) % 4,
					length: parseInt(colour.substring(2, 7), 16)
				};
			})
	);
}

function getArea(plan: { direction: number; length: number }[]) {
	const perimeter = plan.reduce((accumulator, step) => accumulator + step.length, 0);

	// turn the directions into actual points
	let current = { x: 0, y: 0 };
	const points = [current];
	for (const { direction, length } of plan) {
		const next = {
			x: current.x + CARDINALS[direction].x * length,
			y: current.y + CARDINALS[direction].y * length
		};
		points.push(next);
		current = next;
	}

	// calculate the area with shoelace formula
	let area = 0;
	for (let i = 0; i < points.length - 1; i++) {
		// examples are clockwise loops which give a negative area
		// take the negative `b - a` instead of `a - b`
		area += points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
	}
	area /= 2;

	// 1. half the perimeter is inside the area
	// 2. there are 4 extra quarters at the outer corners
	return area + perimeter / 2 + 1;
}
