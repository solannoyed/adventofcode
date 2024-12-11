export default function (input: string) {
	let stones = input
		.trim()
		.split(' ')
		.map((num) => parseInt(num));

	for (let blink = 0; blink < 25; blink++) {
		const next: typeof stones = [];
		for (let stone = 0; stone < stones.length; stone++) {
			if (stones[stone] === 0) next.push(1);
			else {
				const str = stones[stone].toString();
				if (str.length % 2 === 0) {
					next.push(parseInt(str.substring(0, str.length / 2)));
					next.push(parseInt(str.substring(str.length / 2)));
				} else next.push(stones[stone] * 2024);
			}
		}
		stones = next;
	}
	return stones.length;
}
