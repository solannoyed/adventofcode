export default function (input: string) {
	let result = 0;
	const regex = /mul\((\d+),(\d+)\)/g;
	for (const match of input.matchAll(regex)) {
		result += parseInt(match[1]) * parseInt(match[2]);
	}
	return result;
}
