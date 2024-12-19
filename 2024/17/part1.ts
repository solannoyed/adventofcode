export default function (input: string) {
	const groups = input.trim().split('\n\n');
	const registers = groups[0].split('\n').map((line) => parseInt(line.split(': ')[1]));
	const program = groups[1]
		.split(': ')[1]
		.split(',')
		.map((val) => parseInt(val));

	const output = [];

	let instruction = 0;
	while (instruction < program.length) {
		const opcode = program[instruction];
		const operand = program[instruction + 1];

		let combo: number;
		if (operand === 7) {
			console.error('reserved operand, invalid');
			return;
		}

		if (operand < 4) {
			combo = operand;
		} else {
			combo = registers[operand - 4];
		}

		switch (opcode) {
			case 0:
				registers[0] = Math.floor(registers[0] / Math.pow(2, combo));
				break;
			case 1:
				registers[1] = registers[1] ^ operand;
				break;
			case 2:
				registers[1] = combo % 8;
				break;
			case 3:
				if (registers[0] === 0) break;
				instruction = operand;
				continue;
			case 4:
				registers[1] = registers[1] ^ registers[2];
				break;
			case 5:
				output.push(combo % 8);
				break;
			case 6:
				registers[1] = Math.floor(registers[0] / Math.pow(2, combo));
				break;
			case 7:
				registers[2] = Math.floor(registers[0] / Math.pow(2, combo));
				break;
			default:
				console.error('invalid opcode');
				return;
		}

		instruction += 2;
	}

	return output.join(',');
}
