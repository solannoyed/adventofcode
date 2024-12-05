export default function (input: string) {
	const groups = input
		.trim()
		.split('\n\n')
		.map((group) => group.split('\n'));

	const workflows = new Map<string, Rule[]>();
	groups[0].forEach((line) => {
		const [name, ...rest] = line.substring(0, line.length - 1).split(/[{,]/);
		workflows.set(name, getRules(rest));
	});

	const parts: Part[] = groups[1].map((line) =>
		JSON.parse(line.replaceAll('=', ':').replaceAll('{', '{"').replaceAll(':', '":').replaceAll(',', ',"'))
	);

	let result = 0;
	for (const part of parts) {
		let destination = 'in';
		rule: while (destination != 'A' && destination != 'R') {
			for (const rule of workflows.get(destination)!) {
				if (rule.operator == '<' && part[rule.category!] >= rule.value!) continue;
				if (rule.operator == '>' && part[rule.category!] <= rule.value!) continue;
				destination = rule.destination;
				continue rule;
			}
		}
		if (destination == 'A') {
			result += part.x + part.m + part.a + part.s;
		}
	}

	return result;
}

function getRules(input: string[]) {
	return input.map((item) => {
		const colon = item.indexOf(':');
		if (colon < 0) return { destination: item } as Rule;
		return {
			category: item[0],
			operator: item[1],
			value: parseInt(item.substring(2, colon)),
			destination: item.substring(colon + 1)
		} as Rule;
	});
}

type Part = Record<Category, number>;

interface Rule {
	category?: Category;
	operator?: Operator;
	value?: number;
	destination: string; // 'R': rejected | 'A': accepted | string: name
}

type Category = 'x' | 'm' | 'a' | 's';
type Operator = '>' | '<';
