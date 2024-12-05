export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			const mins = {
				red: 0,
				green: 0,
				blue: 0
			};
			const handfulls = line
				.substring(line.indexOf(':') + 2)
				.split('; ')
				.map((handfull) => handfull.split(', '));
			for (const handfull of handfulls) {
				for (const cubes of handfull) {
					const [count, colour] = cubes.split(' ') as [string, keyof typeof mins];
					mins[colour] = Math.max(mins[colour], parseInt(count));
				}
			}
			return mins.red * mins.green * mins.blue;
		})
		.reduce((sum, value) => sum + value);
}
