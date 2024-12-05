export default function (input: string) {
	const boxes: Box[] = new Array(256);
	for (let index = 0; index < boxes.length; index++) {
		boxes[index] = { lenses: [] };
	}

	if (input.trim() == 'HASH') return -1; // ignore the first sample

	input
		.trim()
		.split(',')
		.forEach((seq) => {
			if (seq.at(-1) == '-') {
				const label = seq.substring(0, seq.length - 1);
				remove(label, boxes[hash(label)]);
			} else {
				const lens: Lens = {
					label: seq.substring(0, seq.indexOf('=')),
					length: parseInt(seq.at(-1)!)
				};
				replace(lens, boxes[hash(lens.label)]);
			}
		});
	let sum = 0;
	for (let box = 0; box < boxes.length; box++) {
		for (let lens = 0; lens < boxes[box].lenses.length; lens++) {
			sum += (box + 1) * (lens + 1) * boxes[box].lenses[lens].length;
		}
	}
	return sum;
}

function hash(input: string) {
	let current = 0;
	for (let index = 0; index < input.length; index++) {
		current += input.charCodeAt(index);
		current *= 17;
		current %= 256;
	}
	return current;
}

function remove(label: string, box: Box) {
	const index = box.lenses.findIndex((lens) => lens.label == label);
	if (index >= 0) box.lenses.splice(index, 1);
}

function replace(replacement: Lens, box: Box) {
	const index = box.lenses.findIndex((lens) => lens.label == replacement.label);
	if (index >= 0) {
		box.lenses[index] = replacement;
	} else {
		box.lenses.push(replacement);
	}
}

interface Box {
	lenses: Lens[];
}

interface Lens {
	label: string;
	length: number;
}
