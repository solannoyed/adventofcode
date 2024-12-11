export default function (input: string) {
	let stones = new Map<number, number>();
	input
		.trim()
		.split(' ')
		.forEach((val) => {
			const num = parseInt(val);
			stones.set(num, 1);
		});

	for (let blink = 0; blink < 75; blink++) {
		const next: typeof stones = new Map();
		stones.forEach((count, value) => {
			if (value === 0) {
				next.set(1, (next.get(1) ?? 0) + count);
			} else {
				const str = value.toString();
				if (str.length % 2 === 0) {
					const first = parseInt(str.substring(0, str.length / 2));
					next.set(first, (next.get(first) ?? 0) + count);

					const second = parseInt(str.substring(str.length / 2));
					next.set(second, (next.get(second) ?? 0) + count);
				} else {
					const n = value * 2024;
					next.set(n, (next.get(n) ?? 0) + count);
				}
			}
		});
		stones = next;
	}

	let result = 0;
	stones.forEach((value) => {
		result += value;
	});
	return result;
}
