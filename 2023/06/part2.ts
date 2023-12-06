import { getMargin } from './part1';

export default function (input: string) {
	const [time, distance] = input
		.trim()
		.split('\n')
		.map((line) =>
			parseInt(
				line
					.split(':')[1]
					.trim()
					.split(' ')
					.filter((s) => s.length > 0)
					.join('')
			)
		);
	return getMargin(time, distance);
}
