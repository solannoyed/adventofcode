export default function (input: string) {
	const [inputValues, inputGates] = input.trim().split('\n\n');

	const zs: string[] = [];

	const wires = new Map<string, number>();
	inputValues.split('\n').forEach((line) => {
		const [wire, val] = line.split(': ');
		wires.set(wire, parseInt(val));

		if (wire.startsWith('z')) zs.push(wire);
	});

	const gates = new Map<string, { first: string; second: string; operation: string }>();
	inputGates.split('\n').forEach((line) => {
		const [first, operation, second, , wire] = line.split(' ');
		gates.set(wire, { first, operation, second });

		if (wire.startsWith('z')) zs.push(wire);
	});

	const queue = [...zs];
	while (queue.length > 0) {
		const current = queue.pop()!;
		if (wires.has(current)) continue;

		const gate = gates.get(current)!;
		if (wires.has(gate.first) && wires.has(gate.second)) {
			const first = wires.get(gate.first)!;
			const second = wires.get(gate.second)!;

			switch (gate.operation) {
				case 'AND':
					wires.set(current, first + second === 2 ? 1 : 0);
					break;
				case 'OR':
					wires.set(current, first + second > 0 ? 1 : 0);
					break;
				case 'XOR':
					wires.set(current, first + second === 1 ? 1 : 0);
					break;
				default:
					console.error('invalid operation:', gate.operation);
			}
		} else {
			if (!wires.has(gate.first)) queue.push(gate.first);
			if (!wires.has(gate.second)) queue.push(gate.second);
			queue.unshift(current);
		}
	}

	return zs
		.sort()
		.map((wire) => wires.get(wire)!)
		.reduce((accumulator, value, index) => accumulator + value * Math.pow(2, index), 0);
}
