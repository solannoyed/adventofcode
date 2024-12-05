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

	const ranges: Range[] = [
		{
			rule: 'in',
			start: {
				x: 1,
				m: 1,
				a: 1,
				s: 1
			},
			end: {
				x: 4000,
				m: 4000,
				a: 4000,
				s: 4000
			}
		}
	];

	let result = 0;
	range: while (ranges.length > 0) {
		const current = ranges.pop()!;
		for (const rule of workflows.get(current.rule)!) {
			if (!rule.category) {
				if (rule.destination == 'A') {
					result += getCombinations(current);
				} else if (rule.destination != 'R') {
					current.rule = rule.destination;
					ranges.push(current);
				}
				continue range;
			}

			const operator = rule.operator!;
			const category = rule.category!;
			const value = rule.value!;
			const range: Range = {
				rule: rule.destination,
				start: { ...current.start },
				end: { ...current.end }
			};

			if (operator == '<' && current.start[category] < value) {
				if (current.end[category] < value) {
					current.rule = rule.destination;
					ranges.push(current);
					continue range;
				}

				range.end[category] = value - 1;
				current.start[category] = value;

				if (range.rule == 'A') {
					result += getCombinations(range);
				} else if (range.rule != 'R') ranges.push(range);
			} else if (operator == '>' && current.end[category] > value) {
				if (current.start[category] > value) {
					current.rule = rule.destination;
					ranges.push(current);
					continue range;
				}

				range.start[category] = value + 1;
				current.end[category] = value;

				if (range.rule == 'A') {
					result += getCombinations(range);
				} else if (range.rule != 'R') ranges.push(range);
			}
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

function getCombinations(range: Range) {
	return (
		(1 + range.end.x - range.start.x) *
		(1 + range.end.m - range.start.m) *
		(1 + range.end.a - range.start.a) *
		(1 + range.end.s - range.start.s)
	);
}

interface Range {
	rule: string;
	start: Part;
	end: Part;
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
