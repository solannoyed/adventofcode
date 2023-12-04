import { describe, expect, test } from 'bun:test';
import process from './part2';

const SAMPLE_RESULT = 30;

describe('2023/04 Part 2', async () => {
	test('sample', async () => {
		const input = Bun.file(`${import.meta.dir}/input.sample.txt`);
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
		console.log('Result:', process(await input.text()));
	});
});
