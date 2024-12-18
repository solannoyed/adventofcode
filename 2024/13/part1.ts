export default function (input: string) {
	const buttonRegex = /^Button [AB]: X\+(?<x>\d+), Y\+(?<y>\d+)$/;
	const prizeRegex = /^Prize: X=(?<x>\d+), Y=(?<y>\d+)$/;
	return input
		.trim()
		.split('\n\n')
		.map((group) => group.split('\n'))
		.map(([a, b, prize]) => {
			return {
				a: buttonRegex.exec(a)!.groups! as { x: string; y: string },
				b: buttonRegex.exec(b)!.groups! as { x: string; y: string },
				prize: prizeRegex.exec(prize)!.groups! as { x: string; y: string }
			};
		})
		.map(({ a, b, prize }) => {
			return {
				a: {
					x: parseInt(a.x),
					y: parseInt(a.y)
				},
				b: {
					x: parseInt(b.x),
					y: parseInt(b.y)
				},
				prize: {
					x: parseInt(prize.x),
					y: parseInt(prize.y)
				}
			};
		})
		.map((machine) => minTokens(machine))
		.filter((tokens) => tokens < 100000)
		.reduce((accumulator, value) => accumulator + value);
}

function minTokens({ a, b, prize }: Machine) {
	let minTokens = 100000;

	for (let countA = 0; countA < 100; countA++) {
		const x = countA * a.x;
		const y = countA * a.y;
		if (x > prize.x || y > prize.y) break;
		const remain = {
			x: prize.x - x,
			y: prize.y - y
		};
		if (remain.x % b.x !== 0 || remain.y % b.y !== 0) continue;
		const countB = {
			x: remain.x / b.x,
			y: remain.y / b.y
		};
		if (countB.x !== countB.y) continue;
		minTokens = Math.min(minTokens, countA * 3 + countB.y);
	}

	return minTokens;
}

interface Coordinate {
	x: number;
	y: number;
}

interface Machine {
	a: Coordinate;
	b: Coordinate;
	prize: Coordinate;
}
