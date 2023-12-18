export default function (input: string) {
	return input
		.trim()
		.split('\n\n')
		.map((group) => group.split('\n'))
		.map((group) => {
			return {
				vertical: verticalReflections(group),
				horizontal: horizontalReflections(group)
			};
		})
		.reduce(
			(accumulator, { vertical, horizontal }) => accumulator + vertical + 100 * horizontal,
			0
		);
}

function verticalReflections(group: string[]) {
	let reflections = 0;
	for (let column = 1; column < group[0].length; column++) {
		if (verticallyReflected(group, column)) reflections += column;
	}
	return reflections;
}

function horizontalReflections(group: string[]) {
	let reflections = 0;
	for (let row = 1; row < group.length; row++) {
		if (horizontallyReflected(group, row)) reflections += row;
	}
	return reflections;
}

function verticallyReflected(group: string[], col: number) {
	row: for (let row = 0; row < group.length; row++) {
		for (let offset = 1; col + offset <= group[row].length; offset++) {
			if (col - offset < 0 || col + offset - 1 > group[row].length) continue row;
			if (group[row][col - offset] != group[row][col + offset - 1]) return false;
		}
	}
	return true;
}

function horizontallyReflected(group: string[], row: number) {
	col: for (let col = 0; col < group[row].length; col++) {
		for (let offset = 1; row + offset <= group.length; offset++) {
			if (row - offset < 0 || row + offset - 1 > group.length) continue col;
			if (group[row - offset][col] != group[row + offset - 1][col]) return false;
		}
	}
	return true;
}
