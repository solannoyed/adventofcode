import process from './part1';

export default function (input: string) {
	return process(input, ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'], 0);
}
