export default function (input: string) {
	const hailstones = input
		.trim()
		.split('\n')
		.map((line) =>
			line
				.split(' @ ')
				.map((side) => side.split(', ').map((num) => parseInt(num)))
				.map(([x, y, z]) => {
					return {
						x,
						y,
						z
					};
				})
		)
		.map(([position, velocity]) => {
			return {
				position,
				velocity,
				a: velocity.y,
				b: -velocity.x,
				c: velocity.x * position.y - velocity.y * position.x
			};
		});

	// x = x0 + vx * t -> t = (x - x0) / vx
	// y = y0 + vy * t -> t = (y - y0) / vy
	// vy (x - x0) = vx (y - y0)
	// ax + by + c = 0
	// a = vy, b = -vx, c = vx * y0 - vy * x0

	const RANGE = {
		min: 200000000000000,
		max: 400000000000000
	};

	let collisions = 0;
	for (let first = 0; first < hailstones.length; first++) {
		for (let second = first + 1; second < hailstones.length; second++) {
			const collision = intersection(hailstones[first], hailstones[second]);
			if (collision.x < RANGE.min || collision.x > RANGE.max) continue;
			if (collision.y < RANGE.min || collision.y > RANGE.max) continue;
			if (hailstones[first].velocity.x >= 0 && collision.x < hailstones[first].position.x) continue;
			if (hailstones[first].velocity.x <= 0 && collision.x > hailstones[first].position.x) continue;
			if (hailstones[second].velocity.x >= 0 && collision.x < hailstones[second].position.x)
				continue;
			if (hailstones[second].velocity.x <= 0 && collision.x > hailstones[second].position.x)
				continue;
			collisions++;
		}
	}

	return collisions;
}

function intersection(first: Hailstone, second: Hailstone) {
	const denominator = first.a * second.b - second.a * first.b;
	return {
		x: (first.b * second.c - second.b * first.c) / denominator,
		y: (first.c * second.a - second.c * first.a) / denominator,
		z: 0
	};
}

type Coordinate = {
	x: number;
	y: number;
	z: number;
};

type Hailstone = {
	position: Coordinate;
	velocity: Coordinate;
	a: number;
	b: number;
	c: number;
};
