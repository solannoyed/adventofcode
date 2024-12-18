export default function (input: string) {
	const SIZE = {
		x: 101,
		y: 103
	};
	const SECONDS = 100;

	// the sample is a different size
	if (input.length < 200) {
		SIZE.x = 11;
		SIZE.y = 7;
	}

	const robotRegex = /^p=(?<px>\d+),(?<py>\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)$/;

	const robots = input
		.trim()
		.split('\n')
		.map((line) => {
			const groups = robotRegex.exec(line)!.groups! as { px: string; py: string; vx: string; vy: string };
			const position = {
				x: parseInt(groups.px),
				y: parseInt(groups.py)
			};
			const velocity = {
				x: parseInt(groups.vx),
				y: parseInt(groups.vy)
			};
			const destination = {
				x: (position.x + SECONDS * velocity.x) % SIZE.x,
				y: (position.y + SECONDS * velocity.y) % SIZE.y
			};
			if (destination.x < 0) destination.x += SIZE.x;
			if (destination.y < 0) destination.y += SIZE.y;
			return destination;
		});

	// Calculate the Safety Factor
	const quadrants = [
		[0, 0],
		[0, 0]
	];
	const middle = {
		x: (SIZE.x - 1) / 2,
		y: (SIZE.y - 1) / 2
	};
	for (const robot of robots) {
		if (robot.x === middle.x || robot.y === middle.y) continue;
		quadrants[robot.y < middle.y ? 0 : 1][robot.x < middle.x ? 0 : 1]++;
	}
	return quadrants.reduce(
		(accumulator, row) => accumulator * row.reduce((accumulator, quadrant) => accumulator * quadrant, 1),
		1
	);
}
