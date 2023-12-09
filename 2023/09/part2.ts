export default function (input: string) {
	const histories = input
		.trim()
		.split('\n')
		.map((line) => [line.split(' ').map((num) => parseInt(num))]);
	for (const history of histories) {
		for (let step = 0; step < history.length; step++) {
			if (!history[step].some((value) => value != 0)) break;
			let next: number[] = [];
			for (let index = 1; index < history[step].length; index++) {
				next.push(history[step][index] - history[step][index - 1]);
			}
			history.push(next);
		}

		for (let index = history.length - 1; index > 0; index--) {
			history[index - 1].unshift(history[index - 1][0] - history[index][0]);
		}
	}

	return histories.reduce((accumulator, history) => {
		return accumulator + history[0][0];
	}, 0);
}
