export default function (input: string) {
	let result = 0;
	const regex = /(?<func>do|don't|mul)\((?:(?<first>\d+),(?<second>\d+))?\)/g;
	let enabled = true;
	for (const match of input.matchAll(regex)) {
		const func = match.groups?.['func'];
		if (func === 'do') {
			enabled = true;
		} else if (func === "don't") {
			enabled = false;
		} else if (enabled) {
			const first = parseInt(match.groups?.['first'] ?? '0');
			const second = parseInt(match.groups?.['second'] ?? '0');
			result += first * second;
		}
	}
	return result;
}
