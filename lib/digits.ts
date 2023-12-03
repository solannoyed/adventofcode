export const DIGITS = [
	{ string: '1', value: 1 },
	{ string: '2', value: 2 },
	{ string: '3', value: 3 },
	{ string: '4', value: 4 },
	{ string: '5', value: 5 },
	{ string: '6', value: 6 },
	{ string: '7', value: 7 },
	{ string: '8', value: 8 },
	{ string: '9', value: 9 }
];

export function isDigit(char: string) {
	return char.length == 1 && char >= '0' && char <= '9';
}
