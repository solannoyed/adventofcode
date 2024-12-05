export default function (input: string, rate = 2) {
	const universe = input
		.trim()
		.split('\n')
		.map((line) => line.split(''));

	const galaxies: { x: number; y: number }[] = [];
	const emptyy: number[] = [];
	for (let y = 0; y < universe.length; y++) {
		let found = false;
		for (let x = 0; x < universe[y].length; x++) {
			if (universe[y][x] == '#') {
				galaxies.push({ x, y });
				found = true;
			}
		}
		if (!found) {
			emptyy.push(y + emptyy.length * (rate - 1));
		}
	}

	const emptyx: number[] = [];
	for (let x = 0; x < universe[0].length; x++) {
		let found = false;
		for (let y = 0; y < universe.length; y++) {
			if (universe[y][x] == '#') found = true;
		}
		if (!found) emptyx.push(x + emptyx.length * (rate - 1));
	}

	for (const galaxy of galaxies) {
		for (const x of emptyx) {
			if (galaxy.x > x) galaxy.x += rate - 1;
		}
		for (const y of emptyy) {
			if (galaxy.y > y) galaxy.y += rate - 1;
		}
	}

	let sum = 0;
	for (let first = 0; first < galaxies.length - 1; first++) {
		for (let second = first + 1; second < galaxies.length; second++) {
			sum +=
				Math.abs(galaxies[first].y - galaxies[second].y) +
				Math.abs(galaxies[first].x - galaxies[second].x);
		}
	}
	return sum;
}
