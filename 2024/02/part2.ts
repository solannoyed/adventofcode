export default function (input: string) {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			return line.split(' ').map((val) => parseInt(val));
		})
		.filter((record) => checkRecord(record)).length;
}

function checkRecord(record: number[], skip: number | undefined = undefined): boolean {
	if (record.length < 3) return true;
	let lower = 1;
	let upper = 3;
	if (record[0] > record.at(-1)!) {
		lower = -3;
		upper = -1;
	}
	for (let index = 0; index < record.length - 1; index++) {
		let first = index;
		let second = index + 1;
		if (skip === first) first--;
		if (skip === second) second++;
		if (first < 0) continue;
		if (second >= record.length) continue;
		if (record[first] + lower > record[second] || record[first] + upper < record[second]) {
			if (skip !== undefined) return false;
			return checkRecord(record, first) || checkRecord(record, second);
		}
	}
	return true;
}
