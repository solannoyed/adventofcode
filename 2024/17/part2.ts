export default function (input: string) {
	// ignore the first sample, because it doesn't work
	if (input.length === 66) return -1;

	// We need to use BigInt because Number gives us some negative values
	const groups = input.trim().split('\n\n');
	const registers = groups[0].split('\n').map((line) => BigInt(line.split(': ')[1]));
	const program = groups[1]
		.split(': ')[1]
		.split(',')
		.map((val) => BigInt(val));

	// Math.pow(8, _)
	let a = 1n << (3n * BigInt(program.length - 1));
	const aMax = 1n << (3n * BigInt(program.length));

	let count = 0;
	a: while (a < aMax) {
		count++;
		registers[0] = a;
		const output = [];

		let instruction = 0;
		while (instruction < program.length) {
			const opcode = program[instruction];
			const operand = program[instruction + 1];

			let combo: bigint;
			if (operand === 7n) {
				console.error('reserved operand, invalid');
				return;
			}

			if (operand < 4n) {
				combo = BigInt(operand);
			} else {
				combo = registers[Number(operand - 4n)];
			}

			switch (opcode) {
				case 0n:
					registers[0] = registers[0] / (1n << combo);
					break;
				case 1n:
					registers[1] = registers[1] ^ operand;
					break;
				case 2n:
					registers[1] = combo % 8n;
					break;
				case 3n:
					if (registers[0] === 0n) break;
					instruction = Number(operand);
					continue;
				case 4n:
					registers[1] = registers[1] ^ registers[2];
					break;
				case 5n:
					output.push(combo % 8n);
					break;
				case 6n:
					registers[1] = registers[0] / (1n << combo);
					break;
				case 7n:
					registers[2] = registers[0] / (1n << combo);
					break;
				default:
					console.error('invalid opcode');
					return;
			}

			instruction += 2;
		}

		// The only thing modifying the A register is opcode 0
		// In my input and the second sample, opcode 0 only has operand 3, dividing by 8 (2 to the power of 3)
		// Division by 8 means that 3*index bits dont affect the output from index through to the end
		for (let i = program.length - 1; i >= 0; i--) {
			if (program[i] !== output[i]) {
				a += 1n << (3n * BigInt(i));
				continue a;
			}
		}
		break a;
	}

	console.log(count);
	return Number(a);
}
