const PRIZE_ADJUSTMENT = 10000000000000;

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
					x: parseInt(prize.x) + PRIZE_ADJUSTMENT,
					y: parseInt(prize.y) + PRIZE_ADJUSTMENT
				}
			};
		})
		.map((machine) => minTokens(machine))
		.reduce((accumulator, value) => accumulator + value, 0);
}

// A * ax + B * bx = px
// A = (px - B * bx) / ax
// B = (px - A * ax) / bx
//
// A * ay + B * by = py
// B = (py - A * ay) / by
//
// B == B
// (px - A * ax) / bx = (py - A * ay) / by
// by * (px - A * ax) = bx * (py - A * ay)
// by * px - A * ax * by = bx * py - A * ay * bx
// A * (ay * bx - ax * by) = (bx * py - by * px)
// A = (bx * py - by * px) / (ay * bx - ax * by)

function minTokens({ a, b, prize }: Machine) {
	const A = (b.x * prize.y - b.y * prize.x) / (a.y * b.x - a.x * b.y);
	if (!Number.isInteger(A)) return 0;

	const B = (prize.x - A * a.x) / b.x;
	if (!Number.isInteger(B)) return 0;

	return 3 * A + B;
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
