export default function (input: string) {
	const lines = input
		.trim()
		.split('\n')
		.map((line) =>
			line.split(' ').map((part) => part.split(/[.,]/).filter((item) => item.length > 0))
		);

	let result = 0;
	for (const [arrangement, springs] of lines) {
		let variations = 0;
		const lengths = springs.map((spring) => parseInt(spring));

		const queue = [{ arrangement, lengths }];
		while (queue.length > 0) {
			const { arrangement, lengths } = queue.pop()!;
			if (lengths.length == 0) {
				if (!arrangement.some((item) => item.includes('#'))) {
					variations++;
				}
				continue; // we successfully put all the items in (and the rest are `0`)
			} else if (arrangement.length == 0) {
				continue; // we ran out of space
			}
			const check = arrangement.shift()!;

			lengths.unshift(0);
			for (let index = 0; index < 2; index++) {
				const length = lengths[index];
				// check if can insert this `length` of `#`s into `check`
				if (check.length < length) continue; // can only put in if there is space
				if (check.length > length && check[length] == '#') continue; // can only put in if the following is not a hash

				const nextArrangement = [check.substring(length + 1), ...arrangement];
				const nextLengths = [...lengths];
				nextLengths.splice(nextLengths.indexOf(length), 1);
				queue.push({
					arrangement: nextArrangement.filter((item) => item.length > 0),
					lengths: [...nextLengths.filter((length) => length > 0)]
				});
			}
		}
		result += variations;
	}
	return result;
}
