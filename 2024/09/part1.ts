export default function (input: string) {
	input = input.trim();
	const OFFSET = '0'.charCodeAt(0);

	let result = 0;
	let position = 0;
	let endIndex = input.length - 1;
	let endId = endIndex / 2;
	let remaining = input.charCodeAt(endIndex) - OFFSET;
	for (let index = 0; index < input.length; index++) {
		let length = input.charCodeAt(index) - OFFSET;
		const id = index / 2;
		if (id >= endId) {
			result += id * remaining * (2 * position + remaining - 1) * 0.5;
			break;
		} else if (index % 2 === 0) {
			result += id * length * (2 * position + length - 1) * 0.5;
			position += length;
		} else {
			while (length > 0) {
				if (remaining <= length) {
					result += endId * remaining * (2 * position + remaining - 1) * 0.5;
					position += remaining;
					length -= remaining;
					endId--;
					endIndex -= 2;
					remaining = input.charCodeAt(endIndex) - OFFSET;
				} else {
					result += endId * length * (2 * position + length - 1) * 0.5;
					position += length;
					remaining -= length;
					length = 0;
				}
			}
		}
	}
	return result;
}
