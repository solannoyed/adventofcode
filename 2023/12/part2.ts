export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map<Arrangement>((line) => {
			let [first, second] = line.split(' ');
			let sections = `?${first}`.repeat(5).substring(1);
			const blocked: number[] = [];
			const required: number[] = [];
			for (let index = 0; index < sections.length; index++) {
				if (sections[index] == '.') blocked.push(index);
				else if (sections[index] == '#') required.push(index);
			}
			return {
				position: 0,
				blocked,
				required,
				length: sections.length,
				springs: `,${second}`
					.repeat(5)
					.substring(1)
					.split(',')
					.map((num) => parseInt(num))
			};
		})
		.map((arrangement) => variationCount(arrangement))
		.reduce((sum, variations) => sum + variations);
}

const memo: Map<string, number> = new Map();
function variationCount({ position, blocked, required, length, springs }: Arrangement) {
	if (position == 0) memo.clear();
	const hash = `${position},${springs.length}`;
	if (memo.has(hash)) return memo.get(hash)!;

	if (springs.length == 0) {
		if (required.length > 0) {
			memo.set(hash, 0);
			return 0;
		} else {
			memo.set(hash, 1);
			return 1;
		}
	}

	if (position + springs.reduce((sum, value) => sum + value, springs.length - 1) > length) {
		memo.set(hash, 0);
		return 0;
	}

	let count = 0;

	// if we are not *required* to put a spring here, try skipping
	//  (required with being by the arrangement or remaining space for springs);
	if (required[0] != position && position < length - springs[0]) {
		count += variationCount({
			position: position + 1,
			blocked: blocked[0] == position ? blocked.slice(1) : blocked,
			required,
			length,
			springs
		});
	}

	// make sure there is no block in the length of the spring
	const [spring, ...leftover] = springs;
	if (blocked[0] < position + spring) {
		memo.set(hash, count);
		return count;
	}

	// make sure there is no `required` immediately after the spring
	let require = 0;
	while (required[require] < position + spring) require++;
	if (required[require] == position + spring) {
		memo.set(hash, count);
		return count;
	}

	count += variationCount({
		position: position + spring + 1,
		blocked: blocked[0] == position + spring ? blocked.slice(1) : blocked,
		required: required.slice(require),
		length,
		springs: leftover
	});

	memo.set(hash, count);
	return count;
}

type Arrangement = {
	position: number;
	blocked: number[];
	required: number[];
	length: number;
	springs: number[];
};
