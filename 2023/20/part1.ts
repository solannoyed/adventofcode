export default function (input: string) {
	const modules = new Map<string, Module>();
	input
		.trim()
		.split('\n')
		.forEach((line) => {
			const [module, destinations] = line.split(' -> ');
			if (module == 'broadcaster') {
				modules.set(module, {
					type: 'button',
					label: module,
					inputs: new Map(),
					state: 0,
					outputs: destinations.split(', ')
				});
			} else if (module.startsWith('%')) {
				modules.set(module.substring(1), {
					type: 'flipflop',
					label: module.substring(1),
					inputs: new Map(),
					state: 0,
					outputs: destinations.split(', ')
				});
			} else {
				modules.set(module.substring(1), {
					type: 'conjunction',
					label: module.substring(1),
					inputs: new Map(),
					state: 0,
					outputs: destinations.split(', ')
				});
			}
		});
	for (const [label, module] of modules) {
		for (const destination of module.outputs) {
			modules.get(destination)?.inputs.set(label, 0);
		}
	}

	const pulses: number[][] = [];
	let count = 0;
	do {
		count++;
		pulses.push([0, 0]);
		const queue: { label: string; signal: State; source: string }[] = [
			{ label: 'broadcaster', signal: 0, source: 'button' }
		];

		while (queue.length > 0) {
			const { label, signal, source } = queue.shift()!;
			const module = modules.get(label);
			pulses.at(-1)![signal]++;
			if (module == undefined) continue;

			switch (module.type) {
				case 'flipflop':
					if (signal == 1) continue; // nothing happens with high pulse
					if (module.state) {
						// currently on
						module.state = 0;
					} else {
						// currently off
						module.state = 1;
					}
					for (const destination of module.outputs) {
						queue.push({ label: destination, signal: module.state, source: module.label });
					}
					break;
				case 'conjunction': {
					module.inputs.set(source, signal);
					let pulse: State = 0;
					for (const [, state] of module.inputs) {
						if (state == 0) {
							pulse = 1;
							break;
						}
					}
					for (const destination of module.outputs) {
						queue.push({ label: destination, signal: pulse, source: module.label });
					}
					break;
				}
				case 'button':
					for (const destination of module.outputs) {
						queue.push({
							label: destination,
							signal,
							source: module.label
						});
					}
					break;
			}
		}
	} while (!initialState(modules) && count <= 1000);

	const result = [0, 0];
	for (let i = 0; i < 1000; i++) {
		result[0] += pulses[i % pulses.length][0];
		result[1] += pulses[i % pulses.length][1];
	}

	return result[0] * result[1];
}

function initialState(modules: Map<string, Module>) {
	for (const [, module] of modules) {
		if (module.state == 1) return false;
	}
	return true;
}

interface Module {
	type: 'flipflop' | 'conjunction' | 'button';
	label: string;
	inputs: Map<string, State>;
	state: State; // whether module is on
	outputs: string[];
}

type State = 0 | 1;
