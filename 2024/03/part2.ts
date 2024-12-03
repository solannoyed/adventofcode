export default function (input: string) {
	let result = 0;

	const regDoDont = /do(?:n't)?\(\)/g;
	const dos = [0];
	const donts = [-1];
	for (const match of input.matchAll(regDoDont)) {
		if (match[0] === 'do()') {
			dos.push(match.index!);
		} else donts.push(match.index!);
	}

	const regex = /mul\((\d+),(\d+)\)/g;
	for (const match of input.matchAll(regex)) {
		const first = parseInt(match[1]);
		const second = parseInt(match[2]);
		const index = match.index!;
		let doi = 0;
		while (doi < dos.length - 1 && dos[doi + 1] < index) doi++;
		let donti = 0;
		while (donti < donts.length - 1 && donts[donti + 1] < index) donti++;
		console.log(dos[doi], donts[donti], index);
		if (dos[doi] > donts[donti]) result += first * second;
	}
	return result;
}
