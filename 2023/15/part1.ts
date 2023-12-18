export default function (input: string) {
	return input
		.trim()
		.split(',')
		.map((seq) => {
			let current = 0;
			for (let index = 0; index < seq.length; index++) {
				current += seq.charCodeAt(index);
				current *= 17;
				current %= 256;
			}
			return current;
		})
		.reduce((acc, val) => acc + val);
}
