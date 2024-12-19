export default function (input: string) {
	const [towelsInput, patternsInput] = input.trim().split('\n\n');
	const towels = towelsInput.split(', ');
	const patterns = patternsInput.split('\n');

	return patterns.filter((pattern) => isPatternPossible(pattern, towels)).length;
}

function isPatternPossible(pattern: string, towels: string[]) {
	const queue = [pattern];
	while (queue.length > 0) {
		const current = queue.pop()!;
		for (const towel of towels) {
			if (current === towel) return true;
			if (current.startsWith(towel)) {
				const remaining = current.substring(towel.length);
				if (!queue.includes(remaining)) queue.push(remaining);
			}
		}
	}
	return false;
}
