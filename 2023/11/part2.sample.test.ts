import { describe, expect, test } from 'bun:test';
import process from './part2';

describe('2023/11 Part 2', () => {
	test('input (sample)', async () => {
		const file = Bun.file('2023/11/input.sample.txt');
		expect(await file.exists()).toBeTrue();
		const input = await file.text();
		expect(process(input, 10)).toMatchSnapshot('rate=10');
		expect(process(input, 100)).toMatchSnapshot('rate=100');
	});
});
