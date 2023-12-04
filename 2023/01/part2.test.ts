import { describe, expect, test } from 'bun:test';
import process from './part2';

const SAMPLE_RESULT = 281;

describe('2023/01 Part 2', async () => {
	test('sample2', async () => {
		const input = Bun.file(`${import.meta.dir}/input.sample2.txt`);
		expect(await input.exists()).toBeTrue();
		expect(process(await input.text())).toBe(SAMPLE_RESULT);
	});
	test('input (solannoyed)', async () => {
		const input = Bun.file(`${import.meta.dir}/input.solannoyed.txt`);
		expect(await input.exists()).toBeTrue();
		expect(process(await input.text())).toMatchSnapshot();
	});
	const input = Bun.file(`${import.meta.dir}/input.txt`);
	test.if(await input.exists())('input', async () => {
		const result = process(await input.text());
		expect(result).toMatchSnapshot();
		console.log('Result:', result);
	});
});
