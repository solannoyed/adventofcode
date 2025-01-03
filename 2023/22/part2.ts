export default function (input: string) {
	const bricks = input
		.trim()
		.split('\n')
		.map((line) =>
			line.split('~').map((coords) => {
				const [x, y, z] = coords.split(',');
				return {
					x: parseInt(x),
					y: parseInt(y),
					z: parseInt(z)
				};
			})
		)
		.sort((first, second) => {
			return first[0].z - second[0].z;
		});
	const supporting: Set<number>[] = [];
	const supported: Set<number>[] = [];
	for (let brick = 0; brick < bricks.length; brick++) {
		supporting.push(new Set());
		supported.push(new Set());
	}

	// get bricks landing position
	for (let falling = 0; falling < bricks.length; falling++) {
		let z = 0;
		for (let landed = falling - 1; landed >= 0; landed--) {
			if (bricks[falling][1].x < bricks[landed][0].x || bricks[falling][0].x > bricks[landed][1].x) continue;
			if (bricks[falling][1].y < bricks[landed][0].y || bricks[falling][0].y > bricks[landed][1].y) continue;
			// they overlap on both x and y, so the falling brick lands on top
			if (z > 0) {
				if (z > bricks[landed][1].z) continue; // we are being supported up higher (might be able to break here depending on brick layout)

				// if we have already sat this on top of another brick that is lower...
				if (z < bricks[landed][1].z) {
					// remove the supported for the falling brick
					for (const support of supported[falling]) {
						supporting[support].delete(falling);
					}
					supported[falling].clear();
				}
			}
			z = bricks[landed][1].z;
			supported[falling].add(landed);
			supporting[landed].add(falling);
		}
		bricks[falling][1].z += z - bricks[falling][0].z + 1;
		bricks[falling][0].z = z + 1;
	}

	const result: number[] = new Array(bricks.length).fill(-1);
	for (let brick = 0; brick < bricks.length; brick++) {
		result[brick] = getChain(brick, supporting, supported);
	}
	return result.reduce((accumulator, value) => accumulator + value);
}

function getChain(brick: number, supporting: Set<number>[], supported: Set<number>[]) {
	let result = 0;
	const disintegrated = new Set();
	disintegrated.add(brick);
	const queue = [brick];
	while (queue.length > 0) {
		const current = queue.shift()!;

		// for each thing that the current brick is supporting
		supporting: for (const supportee of supporting[current]) {
			if (disintegrated.has(supportee)) continue;
			// check if it has any remaining `supported`s that arent already disintegrated
			for (const supporter of supported[supportee]) {
				if (!disintegrated.has(supporter)) continue supporting;
			}
			// if not, disintegrate it and add it to the queue
			disintegrated.add(supportee);
			queue.push(supportee);
			result++;
		}
	}
	return result;
}
