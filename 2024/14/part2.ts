const SIZE = {
	x: 101,
	y: 103
};
const SECTOR_BREAKS = [33, 66];

export default function (input: string) {
	// Ignore the sample input
	if (input.length < 200) return 0;

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

			position.x = (((position.x + velocity.x * 7780) % SIZE.x) + SIZE.x) % SIZE.x;
			position.y = (((position.y + velocity.y * 7780) % SIZE.y) + SIZE.y) % SIZE.y;

			return {
				position,
				velocity
			};
		});

	const targetSafety = safetyScore(robots) / 80;

	let seconds = 0;
	do {
		seconds++;
		robots.forEach((robot) => {
			robot.position.x = (robot.position.x + robot.velocity.x + SIZE.x) % SIZE.x;
			robot.position.y = (robot.position.y + robot.velocity.y + SIZE.y) % SIZE.y;
		});
	} while (safetyScore(robots) > targetSafety);
	return seconds;

	// // Visually inspecting a log of the first 100 locations, there is horizontal and vertical grouping for my input:
	// let x_group = 13;
	// let y_group = 65;
	// // These repeat based on the size because the robots loop around each axis
	// while (x_group !== y_group && x_group < SIZE.x * SIZE.y) {
	// 	if (x_group < y_group) x_group += SIZE.x;
	// 	else y_group += SIZE.y;
	// }
	// return x_group === y_group ? x_group : 0;
}

interface Robot {
	position: { x: number; y: number };
	velocity: { x: number; y: number };
}

function safetyScore(robots: Robot[]) {
	const sectors = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (const robot of robots) {
		sectors[robot.position.y < SECTOR_BREAKS[0] ? 0 : robot.position.y > SECTOR_BREAKS[1] ? 2 : 1][
			robot.position.x < SECTOR_BREAKS[0] ? 0 : robot.position.x > SECTOR_BREAKS[1] ? 2 : 1
		]++;
	}
	return sectors.reduce(
		(accumulator, row) => accumulator * row.reduce((accumulator, sector) => accumulator * sector, 1),
		1
	);
}
