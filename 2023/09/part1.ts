export default function (input: string) {
	const histories = input
		.trim()
		.split('\n')
		.map((line) => [line.split(' ').map((num) => parseInt(num))]);
	for (const history of histories) {
		for (let step = 0; step < history.length; step++) {
			if (!history[step].some((value) => value != 0)) break;
			const next: number[] = [];
			for (let index = 1; index < history[step].length; index++) {
				next.push(history[step][index] - history[step][index - 1]);
			}
			history.push(next);
		}

		for (let index = history.length - 1; index > 0; index--) {
			history[index - 1].push(history[index - 1].at(-1)! + history[index].at(-1)!);
		}
	}

	return histories.reduce((accumulator, history) => {
		return accumulator + history[0].at(-1)!;
	}, 0);
}
