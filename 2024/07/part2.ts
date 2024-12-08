export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(' '))
		.map(([first, ...rest]) => {
			return {
				result: parseInt(first.substring(0, first.length - 1)),
				values: rest.map((num) => parseInt(num))
			};
		})
		.filter((equation) => canSolve(equation))
		.reduce((accumulator, equation) => {
			return accumulator + equation.result;
		}, 0);
}

function canSolve({ result, values }: { result: number; values: number[] }) {
	if (values[0] > result) return false;
	if (values.length === 1) return values[0] === result;

	const queue = [{ result: values[0], index: 0 }];
	while (queue.length > 0) {
		const current = queue.pop()!;
		if (current.result > result) continue;
		if (current.result === result && current.index === values.length - 1) return true;
		if (current.index >= values.length - 1) continue;

		queue.push({
			result: current.result + values[current.index + 1],
			index: current.index + 1
		});
		queue.push({
			result: current.result * values[current.index + 1],
			index: current.index + 1
		});
		queue.push({
			result: parseInt(`${current.result}${values[current.index + 1]}`),
			index: current.index + 1
		});
	}
	return false;
}
