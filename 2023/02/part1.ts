export default function (
	input: string,
	limits: { [key: string]: number } = {
		red: 12,
		green: 13,
		blue: 14
	}
) {
	// TODO: could change this to a reduce
	let result = 0;
	line: for (const line of input.trim().split('\n')) {
		const [game, rest] = line.split(': ');
		const handfulls = rest.split('; ').map((handfull) => {
			return handfull.split(', ');
		});
		for (const handfull of handfulls) {
			for (const cubes of handfull) {
				const [count, colour] = cubes.split(' ');
				if (parseInt(count) > limits[colour]) continue line;
			}
		}
		result += parseInt(game.substring(5));
	}
	return result;
}
