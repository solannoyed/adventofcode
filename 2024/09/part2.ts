export default function (input: string) {
	const values = input
		.trim()
		.split('')
		.map((num) => parseInt(num));

	const head: Block = {
		id: 0,
		position: 0,
		length: values[0]
	};
	let prev = head;
	for (let index = 2; index < values.length; index += 2) {
		const block: Block = {
			id: index / 2,
			position: prev.position + prev.length + values[index - 1],
			length: values[index],
			prev
		};
		prev.next = block;
		prev = block;
	}

	let current = prev;
	block: while (current !== head && current.prev !== undefined) {
		let seek = head;
		while (seek !== current && seek.next !== undefined) {
			const space = seek.next.position - (seek.position + seek.length);
			if (space >= current.length) {
				// remove
				const prev = current.prev;
				const next = current.next;
				prev.next = next;
				if (next) next.prev = prev;

				// insert
				current.next = seek.next;
				if (current.next) current.next.prev = current;
				seek.next = current;
				current.prev = seek;

				// update
				current.position = seek.position + seek.length;

				current = prev;
				continue block;
			} else {
				seek = seek.next;
			}
		}
		current = current.prev;
	}

	let result = 0;
	let curr: Block | undefined = head;
	while (curr !== undefined) {
		result += curr.id * curr.length * (2 * curr.position + curr.length - 1) * 0.5;
		curr = curr.next;
	}

	return result;
}

interface Block {
	id: number;
	position: number;
	length: number;
	next?: Block;
	prev?: Block;
}
