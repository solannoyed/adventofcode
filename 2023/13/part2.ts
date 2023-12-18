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

function verticallyReflected(group: string[], column: number) {
	let errors = 0;
	row: for (let row = 0; row < group.length; row++) {
		for (let offset = 1; column + offset <= group[row].length; offset++) {
			if (column - offset < 0 || column + offset - 1 > group[row].length) continue row;
			if (group[row][column - offset] != group[row][column + offset - 1]) {
				if (errors > 1) return false;
				else errors++;
			}
		}
	}
	return errors == 1;
}

function horizontallyReflected(group: string[], row: number) {
	let errors = 0;
	column: for (let column = 0; column < group[row].length; column++) {
		for (let offset = 1; row + offset <= group.length; offset++) {
			if (row - offset < 0 || row + offset - 1 > group.length) continue column;
			if (group[row - offset][column] != group[row + offset - 1][column]) {
				if (errors > 1) return false;
				else errors++;
			}
		}
	}
	return errors == 1;
}
