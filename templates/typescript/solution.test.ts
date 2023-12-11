import { describe, expect, test } from 'bun:test';
import { readdir } from 'node:fs/promises';

const [_, year, day, part] = import.meta.path.match(/\/(20\d{2})\/(\d{2})\/part(\d)\.test\.ts$/i)!;
const { default: process }: { default: (input: string) => number } = await import(`./part${part}`);

describe(`${year}/${day} Part ${part}`, async () => {
	const files = await readdir(import.meta.dir);
	const hashes: string[] = [];
	for (const file of files) {
		const match = file.match(/^input\.(.*)\.txt$/i);
		if (match == null) continue;
		const [_, info] = match!;

		test(`input (${info})`, async () => {
			const input = await Bun.file(`${import.meta.dir}/${file}`).text();
			if (!info.startsWith('sample')) {
				const hash = Bun.hash(input).toString(32);
				hashes.push(hash);
				expect(hash).toBe(info);
			}
			expect(process(input)).toMatchSnapshot();
		});
	}

	const input = Bun.file(`${import.meta.dir}/input.txt`);
	test.if(await input.exists())(`input`, async () => {
		const text = await input.text();
		const hash = Bun.hash(text).toString(32);
		expect(hashes).not.toContain(hash);

		const result = process(text);
		console.log(`Input result (${hash}):`, result);
	});
});
