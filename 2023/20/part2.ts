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
	let rx = false;
	for (const [label, module] of modules) {
		for (const destination of module.outputs) {
			if (destination == 'rx') rx = true;
			modules.get(destination)?.inputs.set(label, 0);
		}
	}
	if (!rx) return -1;

	// const counts = [4091, 4001, 3923, 3847]; // result from my input
	const counts: number[] = [];
	for (const destination of modules.get('broadcaster')!.outputs) {
		counts.push(
			initialStateCount(modules, {
				label: destination,
				signal: 0,
				source: 'broadcaster'
			})
		);
	}

	return counts
		.sort((first, second) => second - first)
		.reduce((first, second) => {
			let multiple = first;
			while (multiple % second > 0) multiple += first;
			return multiple;
		});
}

function initialState(modules: Map<string, Module>) {
	for (const [, module] of modules) {
		if (module.state == 1) return false;
	}
	return true;
}

function initialStateCount(modules: Map<string, Module>, start: { label: string; signal: State; source: string }) {
	let count = 0;
	do {
		count++;
		const queue = [start];

		while (queue.length > 0) {
			const { label, signal, source } = queue.shift()!;
			const module = modules.get(label);
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
	} while (!initialState(modules));
	return count;
}

interface Module {
	type: 'flipflop' | 'conjunction' | 'button';
	label: string;
	inputs: Map<string, State>;
	state: State; // whether module is on
	outputs: string[];
}

type State = 0 | 1; // acts as both whether the module is off/on and a low/high signal
